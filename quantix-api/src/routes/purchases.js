import express from "express";
import { prisma } from "../lib/prisma.js";
import { verifyToken } from "../middleware/auth.js";
import { can } from "../middleware/authz.js";
import { Prisma } from "@prisma/client";

const router = express.Router();

// ---------- Helpers de decimales (2 dígitos) ----------
const d2 = (v) =>
  v instanceof Prisma.Decimal
    ? v.toFixed(2)
    : new Prisma.Decimal(v ?? 0).toFixed(2);

const serializeItem = (it) => ({
  ...it,
  quantity: d2(it.quantity),
  unitCost: d2(it.unitCost),
});

const serializePurchase = (p) => ({
  ...p,
  items: (p.items || []).map(serializeItem),
});

// POST /api/v1/purchases  (201)
router.post("/", verifyToken, can("purchase:create"), async (req, res) => {
  try {
    const { supplier, items } = req.body;

    if (!supplier || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ error: "supplier e items (no vacíos) son obligatorios" });
    }

    // Validación y coerción a Decimal
    for (const it of items) {
      if (!it.productId) {
        return res.status(400).json({ error: "Falta productId en un item" });
      }
      try {
        it.quantity = new Prisma.Decimal(it.quantity);
        it.unitCost = new Prisma.Decimal(it.unitCost);
      } catch {
        return res
          .status(400)
          .json({ error: "quantity y unitCost deben ser numéricos" });
      }
      if (it.quantity.lte(0) || it.unitCost.lt(0)) {
        return res
          .status(400)
          .json({ error: "quantity debe ser > 0 y unitCost >= 0" });
      }
    }

    // Calcula total (no se usa, solo informativo)
    const total = items.reduce(
      (acc, it) => acc.add(it.quantity.mul(it.unitCost)),
      new Prisma.Decimal(0)
    );

    const created = await prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.create({
        data: {
          supplier,
          createdById: req.user.id, 
          // total,                   
          // status: "COMPLETED",     
        },
      });

      // Ítems + movimiento IN + actualizar stock
      for (const it of items) {
        // Verificar producto existente y activo (opcional)
        const prod = await tx.product.findUnique({
          where: { id: it.productId },
          select: { id: true, active: true },
        });
        if (!prod) throw new Error("Producto no encontrado");
        if (prod.active === false) throw new Error("Producto inactivo");

        await tx.purchaseItem.create({
          data: {
            purchaseId: purchase.id,
            productId: it.productId,
            quantity: it.quantity,
            unitCost: it.unitCost,
          },
        });

        await tx.inventoryMovement.create({
          data: {
            productId: it.productId,
            kind: "IN",
            quantity: it.quantity,
            createdById: req.user.id, // audit
          },
        });

        await tx.product.update({
          where: { id: it.productId },
          data: { stock: { increment: it.quantity } },
        });
      }

      // Devolver cabecera con ítems
      const full = await tx.purchase.findUnique({
        where: { id: purchase.id },
        include: { items: true },
      });

      return full;
    });

    return res.status(201).json(serializePurchase(created));
  } catch (e) {
    // Log completo + payload útil al cliente
    console.error("❌ Purchase create error:", e);
    const payload = { error: e?.message || String(e) };
    if (e?.code) payload.code = e.code;
    if (e?.meta) payload.meta = e.meta;
    return res.status(400).json(payload);
  }
});

// GET /api/v1/purchases  →  lista (limit 50, ordenadas por fecha desc)
router.get("/", verifyToken, can("purchase:list"), async (_req, res) => {
  try {
    const list = await prisma.purchase.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { items: true },
    });
    res.json(list.map(serializePurchase));
  } catch (e) {
    console.error("❌ Purchase list error:", e);
    res.status(400).json({ error: e.message });
  }
});

export default router;
