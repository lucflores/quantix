import express from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { verifyToken } from "../middleware/auth.js";
import { can } from "../middleware/authz.js";

const router = express.Router();

/**
 * POST /api/v1/sales
 * body: { customer?: string, items: [{ productId, quantity, unitPrice }] }
 * - Crea cabecera + ítems
 * - Valida stock y genera movimientos OUT (actualiza stock)
 */
router.post("/", verifyToken, can("sale:create"), async (req, res) => {
  const { customer, items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Items requeridos" });
  }

  for (const it of items) {
    const qty = new Prisma.Decimal(it.quantity ?? 0);
    const price = new Prisma.Decimal(it.unitPrice ?? 0);
    if (!it.productId) return res.status(400).json({ error: "productId faltante" });
    if (qty.lte(0) || price.lt(0)) return res.status(400).json({ error: "quantity>0 y unitPrice>=0" });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: { customer: customer ?? null, createdById: req.user.id }
      });

      for (const it of items) {
        const qty = new Prisma.Decimal(it.quantity);
        const unitPrice = new Prisma.Decimal(it.unitPrice);

        const prod = await tx.product.findUnique({ where: { id: it.productId } });
        if (!prod) throw new Error("Producto no encontrado");
        if (!prod.active) throw new Error(`Producto inactivo: ${prod.sku}`);

        // Validar stock suficiente
        const hasStock = prod.stock instanceof Prisma.Decimal
          ? prod.stock.gte(qty)
          : new Prisma.Decimal(prod.stock).gte(qty);

        if (!hasStock) throw new Error(`Stock insuficiente para ${prod.sku}`);

        // Crear item
        await tx.saleItem.create({
          data: {
            saleId: sale.id,
            productId: it.productId,
            quantity: qty,
            unitPrice
          }
        });

        // Movimiento OUT + stock
        await tx.inventoryMovement.create({
          data: {
            productId: it.productId,
            kind: "OUT",
            quantity: qty,
            createdById: req.user.id
          }
        });

        await tx.product.update({
          where: { id: it.productId },
          data: { stock: { decrement: qty } }
        });
      }

      const full = await tx.sale.findUnique({
        where: { id: sale.id },
        include: { items: true }
      });
      return full;
    });

    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

/** Listado simple (últimas 50) */
router.get("/", verifyToken, async (_req, res) => {
  const rows = await prisma.sale.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { items: true }
  });
  res.json(rows);
});

export default router;
