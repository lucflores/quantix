import prisma from '../lib/prisma.js';
import { Prisma } from "@prisma/client";

export async function listSuppliers(req, res, next) {
  try {
    const q = (req.query.q || "").toString().trim();
    const where = q
      ? { 
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
            { cuit: { contains: q, mode: "insensitive" } }
          ]
        }
      : {};
    const items = await prisma.supplier.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100, 
    });
    res.json({ items });

  } catch (err) {
    next(err);
  }
}

export async function createSupplier(req, res, next) {
  try {
    const { name, email, phone, cuit, address } = req.body || {};
    if (!name) return res.status(400).json({ error: "name es obligatorio" });
    const data = { name, active: true };
    if (email) data.email = String(email).trim().toLowerCase();
    if (phone) data.phone = String(phone).trim();
    if (cuit) data.cuit = String(cuit).trim();
    if (address) data.address = String(address).trim();

    const created = await prisma.supplier.create({ data });
    res.status(201).json(created);
  } catch (err) {
    if (err?.code === "P2002") {
      const field = err.meta.target.includes('email') ? 'email' : 'CUIT';
      return res.status(409).json({ error: `El ${field} ya está registrado` });
    }
    next(err);
  }
}

export async function updateSupplier(req, res, next) {
  try {
    const { id } = req.params;
    const { name, email, phone, cuit, address } = req.body || {};
    if (!name) return res.status(400).json({ error: "name es obligatorio" });

    const data = { name };
    if (email !== undefined) data.email = email ? String(email).trim().toLowerCase() : null;
    if (phone !== undefined) data.phone = phone ? String(phone).trim() : null;
    if (cuit !== undefined) data.cuit = cuit ? String(cuit).trim() : null;
    if (address !== undefined) data.address = address ? String(address).trim() : null;
    if (req.body.active !== undefined) {
      data.active = !!req.body.active;
    }

    const updated = await prisma.supplier.update({ where: { id }, data });
    return res.json(updated);
  } catch (err) {
    if (err?.code === "P2025") return res.status(404).json({ error: "Proveedor no encontrado" });
    if (err?.code === "P2002") {
      const field = err.meta.target.includes('email') ? 'email' : 'CUIT';
      return res.status(409).json({ error: `El ${field} ya está registrado` });
    }
    next(err);
  }
}

export async function deleteSupplier(req, res, next) {
  try {
    const { id } = req.params;
    
    await prisma.supplier.delete({ where: { id } });
    return res.status(204).end(); 
  } catch (err) {
    if (err?.code === "P2025") return res.status(404).json({ error: "Proveedor no encontrado" });
    if (err?.code === "P2003") return res.status(409).json({ error: "No se puede eliminar, el proveedor tiene compras asociadas." });
    next(err);
  }
}

export async function disableSupplier(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await prisma.supplier.update({ where: { id }, data: { active: false } });
    res.json(updated);
  } catch (err) {
    if (err?.code === "P2025") return res.status(404).json({ error: "Proveedor no encontrado" });
    next(err);
  }
}

export async function enableSupplier(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await prisma.supplier.update({ where: { id }, data: { active: true } });
    res.json(updated);
  } catch (err) {
    if (err?.code === "P2025") return res.status(404).json({ error: "Proveedor no encontrado" });
    next(err);
  }
}

export async function getSupplierActivity(req, res, next) {
  try {
    const { id } = req.params;
    const supplier = await prisma.supplier.findUnique({
      where: { id },
    });
    if (!supplier) {
      return res.status(404).json({ error: "Proveedor no encontrado" });
    }
    const purchases = await prisma.purchase.findMany({
      where: { supplierId: id },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, sku: true }, 
            },
          },
        },
        supplierRel: { 
          select: { name: true }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 50, 
    });

    const activity = purchases.map(purchase => {
      const totalAmount = purchase.items.reduce((total, item) => {
        const quantity = new Prisma.Decimal(item.quantity); 
        const unitCost = new Prisma.Decimal(item.unitCost);
        return total.add(quantity.times(unitCost));
      }, new Prisma.Decimal(0));

      return {
        ...purchase,
        totalAmount: totalAmount.toFixed(2), 
      };
    });
    res.json({ items: activity });

  } catch (err) {
    next(err);
  }
}