import prisma from '../lib/prisma.js'; 
import { Prisma } from "@prisma/client";

const d2 = (v) => v instanceof Prisma.Decimal ? v.toFixed(2) : new Prisma.Decimal(v ?? 0).toFixed(2);
const D = (v) => new Prisma.Decimal(v ?? 0);
const isMultipleOf = (value, step) => step.eq(0) ? true : value.div(step).isInteger();
const serializeItem = (it) => ({ 
  ...it, 
  quantity: d2(it.quantity), 
  unitCost: d2(it.unitCost),
  product: it.product || null,
});
const serializePurchase = (p) => ({ 
  ...p, 
  items: (p.items || []).map(serializeItem),
  supplierRel: p.supplierRel || null, 
});

export async function createPurchase(req, res) {
  try {
    const { supplierId, items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "items (no vacíos) son obligatorios" });
    }
    for (const it of items) {
      if (!it.productId) return res.status(400).json({ error: "Falta productId en un item" });
      try {
        it.quantity = D(it.quantity);
        it.unitCost = D(it.unitCost);
      } catch {
        return res.status(400).json({ error: "quantity y unitCost deben ser numéricos" });
      }
      if (it.quantity.lte(0) || it.unitCost.lt(0)) {
        return res.status(400).json({ error: "quantity debe ser > 0 y unitCost >= 0" });
      }
    }

    const created = await prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.create({
        data: {
          supplierId: supplierId || null, 
          createdById: req.user.id 
        },
      });
      for (const it of items) {
        const prod = await tx.product.findUnique({
          where: { id: it.productId },
          select: { id: true, active: true, step: true, stock: true },
        });
        if (!prod) throw new Error("Producto no encontrado");
        if (prod.active === false) throw new Error("Producto inactivo");

        const step = prod.step instanceof Prisma.Decimal ? prod.step : D(prod.step);
        if (step.eq(0)) throw new Error("step inválido para el producto");
        if (!isMultipleOf(it.quantity, step)) throw new Error("quantity no respeta step");

        await tx.purchaseItem.create({
          data: {
            purchaseId: purchase.id,
            productId: it.productId,
            quantity: it.quantity,
            unitCost: it.unitCost,
          },
        });

        await tx.inventoryMovement.create({
          data: { productId: it.productId, kind: "IN", quantity: it.quantity, createdById: req.user.id },
        });

        const currentStock = prod.stock instanceof Prisma.Decimal ? prod.stock : D(prod.stock);
        await tx.product.update({
          where: { id: it.productId },
          data: { stock: currentStock.add(it.quantity) },
        });
      }
      return tx.purchase.findUnique({ 
        where: { id: purchase.id }, 
        include: { 
          items: { include: { product: { select: { name: true, sku: true } } } },
          supplierRel: { select: { name: true } }
        } 
      });
    });

    return res.status(201).json(serializePurchase(created));
  } catch (e) {
    console.error("❌ Purchase create error:", e);
    const payload = { error: e?.message || String(e) };
    if (e?.code) payload.code = e.code;
    if (e?.meta) payload.meta = e.meta;
    return res.status(400).json(payload);
  }
}

export async function listPurchases(req, res) {
  try {
    const page = Math.max(parseInt(String(req.query.page || "1"), 10), 1);
    const limit = Math.min(Math.max(parseInt(String(req.query.limit || "20"), 10), 1), 100);
    const skip = (page - 1) * limit;
    const q = (req.query.q || "").toString().trim();
    const where = q ? {
      OR: [
        { supplierRel: { name: { contains: q, mode: 'insensitive' } } },
        { items: { some: { product: { OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { sku: { contains: q, mode: 'insensitive' } }
        ]}}}}
      ]
    } : {}; 

    const list = await prisma.purchase.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { 
        items: { 
          include: { 
            product: { select: { name: true, sku: true } } 
          }
        },
        supplierRel: { select: { name: true } }
      },
    });
    
    const total = await prisma.purchase.count({ where });
    return res.json({
      data: list.map(serializePurchase), 
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
    });
  } catch (e) {
    console.error("❌ Purchase list error:", e);
    return res.status(400).json({ error: e.message });
  }
}