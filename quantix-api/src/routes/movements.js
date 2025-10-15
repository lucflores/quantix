import express from "express";
import { prisma } from "../lib/prisma.js";
import { verifyToken } from "../middleware/auth.js";
import { can } from "../middleware/authz.js";
import { Prisma } from "@prisma/client";

const router = express.Router();

const d2 = (v) =>
  v instanceof Prisma.Decimal ? v.toFixed(2) : new Prisma.Decimal(v ?? 0).toFixed(2);

const serializeMovement = (m) => ({
  id: m.id,
  productId: m.productId,
  product: m.product ? { id: m.product.id, sku: m.product.sku, name: m.product.name } : null,
  kind: m.kind,
  quantity: d2(m.quantity),
  createdById: m.createdById,
  createdAt: m.createdAt,
});

// GET /api/v1/movements  → últimos 100
router.get("/", verifyToken, can("movement:list"), async (_req, res) => {
  try {
    const list = await prisma.inventoryMovement.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { product: true },
    });
    res.json(list.map(serializeMovement));
  } catch (e) {
    console.error("❌ Movements list error:", e);
    res.status(400).json({ error: e.message });
  }
});

export default router;
