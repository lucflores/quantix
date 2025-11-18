import { prisma } from "../lib/prisma.js";
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

    const created = await prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.create({
        data: {
          supplierId: supplierId || null, 
          createdById: req.user.id 
        },
      });

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

export async function listPurchases(req, res, next) {
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
    res.json({
      data: list.map(serializePurchase), 
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
    });
  } catch (e) {
    console.error("❌ Purchase list error:", e);
    next(e);
  }
}
