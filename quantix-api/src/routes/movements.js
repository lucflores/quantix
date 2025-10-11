import express from "express";
import { prisma } from "../lib/prisma.js";
import { verifyToken } from "../middleware/auth.js";
import { Prisma } from "@prisma/client";

const router = express.Router();

/** Crear un movimiento de inventario */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { productId, kind, quantity } = req.body;
    const qtyDec = new Prisma.Decimal(quantity);
    if (!productId || !["IN", "OUT"].includes(kind) || isNaN(qtyDec) || qty <= 0) {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) throw new Error("Producto no encontrado");

      if (kind === "OUT" && product.stock < qtyDec) {
        throw new Error("Stock insuficiente");
      }

      // 1) crear movimiento
      const movement = await tx.inventoryMovement.create({
        data: {
          productId,
          kind,
          quantity: qtyDec,
          createdById: req.user.id,
        },
      });

      // 2) actualizar stock
      await tx.product.update({
        where: { id: productId },
        data: {
          stock: kind === "IN"
              ? { increment: qtyDec }
              : { decrement: qtyDec },
        },
      });

      return movement;
    });

    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

/** Listado simple de últimos movimientos */
router.get("/", verifyToken, async (_req, res) => {
  const rows = await prisma.inventoryMovement.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { product: { select: { sku: true, name: true } } },
  });
  res.json(rows);
});

export default router;
