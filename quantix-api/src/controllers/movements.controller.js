import { prisma } from "../lib/prisma.js";
import { Prisma } from "@prisma/client";

// helpers
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


export async function listMovements(_req, res, next) {
  try {
    const list = await prisma.inventoryMovement.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { product: true },
    });
    return res.json(list.map(serializeMovement));
  } catch (e) {
    return next(e); // el errorHandler devolverá 500
  }
}
