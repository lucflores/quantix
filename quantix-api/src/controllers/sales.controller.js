import { prisma } from "../lib/prisma.js";
import { Prisma } from "@prisma/client";


const d2 = (v) => v instanceof Prisma.Decimal ? v.toFixed(2) : new Prisma.Decimal(v ?? 0).toFixed(2);
const D = (v) => new Prisma.Decimal(v ?? 0);
const serializeSale = (s) => {
  let total = new Prisma.Decimal(0);
  const items = s.items.map(it => {
    const q = it.quantity instanceof Prisma.Decimal ? it.quantity : D(it.quantity);
    const p = it.unitPrice instanceof Prisma.Decimal ? it.unitPrice : D(it.unitPrice);
    total = total.add(q.times(p));
    return {
      ...it,
      quantity: d2(q),
      unitPrice: d2(p)
    };
  });

  return {
    ...s,
    items,
    totalAmount: d2(total),
    createdAt: s.createdAt,
  };
};

export async function listSales(req, res, next) {
  try {
    const page = Math.max(parseInt(String(req.query.page || "1"), 10), 1);
    const limit = Math.min(Math.max(parseInt(String(req.query.limit || "20"), 10), 1), 100);
    const skip = (page - 1) * limit;
    const q = (req.query.q || "").toString().trim();
    const where = q ? {
      OR: [
        { customerRel: { name: { contains: q, mode: "insensitive" } } },
        { customer: { contains: q, mode: "insensitive" } },
        { items: { some: { product: { name: { contains: q, mode: "insensitive" } } } } },
        { items: { some: { product: { sku: { contains: q, mode: "insensitive" } } } } }
      ]
    } : {};

    const list = await prisma.sale.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { 
        customerRel: { select: { name: true, email: true } },
        items: { 
          include: { 
            product: { select: { name: true, sku: true } } 
          }
        }
      },
    });

    const total = await prisma.sale.count({ where });
    res.json({
      data: list.map(serializeSale),
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

export async function createSale(req, res, next) {
  try {
    const { payment, customerId, items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "items es obligatorio" });
    }

    const created = await prisma.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: {
          payment: payment || "EFECTIVO",
          customerId: customerId || null,
          createdById: req.user.id,
        },
      });
      for (const it of items) {
        const quantity = D(it.quantity);
        const unitPrice = D(it.unitPrice); 
        const product = await tx.product.findUnique({ where: { id: it.productId } });
        if (!product) throw new Error(`Producto ${it.productId} no encontrado`);
        const currentStock = D(product.stock);
        if (currentStock.lt(quantity)) {
           throw new Error(`Stock insuficiente para ${product.name}. Stock actual: ${currentStock}, Solicitado: ${quantity}`);
        }
        await tx.saleItem.create({
          data: {
            saleId: sale.id,
            productId: it.productId,
            quantity: quantity,
            unitPrice: unitPrice,
          }
        });

        await tx.inventoryMovement.create({
          data: {
            productId: it.productId,
            kind: "OUT",
            quantity: quantity,
            createdById: req.user.id
          }
        });

        await tx.product.update({
          where: { id: it.productId },
          data: { stock: currentStock.sub(quantity) }
        });
      }

      return tx.sale.findUnique({
        where: { id: sale.id },
        include: { items: true }
      });
    });

    res.status(201).json(serializeSale(created));

  } catch (e) {
    console.error("❌ Sale create error:", e);
    if (e.message.includes("Stock insuficiente")) {
        return res.status(409).json({ error: e.message });
    }
    next(e);
  }
}

export async function getSaleById(req, res, next) {
    try {
        const { id } = req.params;
        const sale = await prisma.sale.findUnique({
            where: { id },
            include: {
                customerRel: true,
                items: { include: { product: true } }
            }
        });
        if (!sale) return res.status(404).json({ error: "Venta no encontrada" });
        res.json(serializeSale(sale));
    } catch (e) {
        next(e);
    }
}