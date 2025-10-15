import { prisma } from "../lib/prisma.js";
import { Prisma } from "@prisma/client";

// ===== Helpers decimales (2 dígitos) =====
const d2 = (v) =>
  v instanceof Prisma.Decimal ? v.toFixed(2) : new Prisma.Decimal(v ?? 0).toFixed(2);

const serializeItem = (it) => ({
  ...it,
  quantity: d2(it.quantity),
  unitPrice: d2(it.unitPrice),
});

const serializeSale = (s) => ({
  ...s,
  items: (s.items || []).map(serializeItem),
});

// POST /api/v1/sales  (201)
export async function createSale(req, res) {
  try {
    const payment = (req.body.payment || "EFECTIVO").toString();
    const { customerId, customer } = req.body;
    const items = Array.isArray(req.body.items) ? req.body.items : [];

    if (!["EFECTIVO", "CTA_CTE"].includes(payment)) {
      return res.status(400).json({ error: "payment inválido (EFECTIVO | CTA_CTE)" });
    }
    if (items.length === 0) {
      return res.status(400).json({ error: "items es obligatorio y no puede estar vacío" });
    }

    // Reglas de cliente según método
    let customerData = {};
    if (payment === "CTA_CTE") {
      if (!customerId) {
        return res.status(400).json({ error: "customerId es obligatorio para cuenta corriente" });
      }
      const c = await prisma.customer.findUnique({ where: { id: customerId } });
      if (!c || c.active === false) {
        return res.status(404).json({ error: "Cliente no encontrado o inactivo" });
      }
      customerData.customerId = customerId;
    } else {
      customerData.customer = customer || null;
    }

    // Validación y coerción de items
    for (const it of items) {
      if (!it.productId) return res.status(400).json({ error: "Falta productId en un item" });
      try {
        it.quantity = new Prisma.Decimal(it.quantity);
        it.unitPrice = new Prisma.Decimal(it.unitPrice);
      } catch {
        return res.status(400).json({ error: "quantity y unitPrice deben ser numéricos" });
      }
      if (it.quantity.lte(0) || it.unitPrice.lt(0)) {
        return res.status(400).json({ error: "quantity debe ser > 0 y unitPrice >= 0" });
      }
    }

    const created = await prisma.$transaction(async (tx) => {
      // Cabecera
      const sale = await tx.sale.create({
        data: {
          ...customerData,
          payment,
          createdById: req.user.id,
        },
      });

      // Ítems + validar stock + movimiento OUT + restar stock
      for (const it of items) {
        const prod = await tx.product.findUnique({
          where: { id: it.productId },
          select: { id: true, active: true, stock: true, name: true },
        });
        if (!prod) throw new Error("Producto no encontrado");
        if (prod.active === false) throw new Error(`Producto inactivo: ${prod.name}`);

        const stockD = prod.stock instanceof Prisma.Decimal ? prod.stock : new Prisma.Decimal(prod.stock);
        if (stockD.lt(it.quantity)) {
          throw new Error(`Stock insuficiente para ${prod.name}`);
        }

        await tx.saleItem.create({
          data: {
            saleId: sale.id,
            productId: it.productId,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
          },
        });

        await tx.inventoryMovement.create({
          data: {
            productId: it.productId,
            kind: "OUT",
            quantity: it.quantity,
            createdById: req.user.id,
          },
        });

        await tx.product.update({
          where: { id: it.productId },
          data: { stock: { decrement: it.quantity } },
        });
      }

      // devolver con items
      return tx.sale.findUnique({
        where: { id: sale.id },
        include: { items: true },
      });
    });

    return res.status(201).json(serializeSale(created));
  } catch (e) {
    console.error("❌ Sale create error:", e);
    const payload = { error: e?.message || String(e) };
    if (e?.code) payload.code = e.code;
    if (e?.meta) payload.meta = e.meta;
    return res.status(400).json(payload);
  }
}

// GET /api/v1/sales  → últimas 50 (con ítems)
export async function listSales(_req, res) {
  try {
    const list = await prisma.sale.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { items: true, customerRel: true },
    });
    return res.json(list.map(serializeSale));
  } catch (e) {
    console.error("❌ Sale list error:", e);
    return res.status(400).json({ error: e.message });
  }
}
