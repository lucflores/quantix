import express from "express";
import { prisma } from "../lib/prisma.js";
import { verifyToken, requireRole } from "../middleware/auth.js";import { Prisma } from "@prisma/client";

const router = express.Router();

//Listado de productos
router.get("/", verifyToken, async (req, res) => {
  // filtros
  const includeInactive = req.query.includeInactive === "1";
  const q = (req.query.q || "").toString().trim();
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limitRaw = parseInt(req.query.limit) || 20;
  const limit = Math.min(Math.max(1, limitRaw), 100);
  const skip = (page - 1) * limit;

  const whereBase = includeInactive ? {} : { active: true };
  const whereSearch = q
    ? {
        OR: [
          { sku:  { contains: q, mode: "insensitive" } },
          { name: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const where = { AND: [whereBase, whereSearch] };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  res.json({
    items,
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
    limit,
    q,
    includeInactive,
  });
});

//Crea un producto 
router.post("/", verifyToken, requireRole?.("ADMIN") ?? ((_, __, next)=>next()), async (req, res) => {
  try {
    const { sku, name, cost, price, stock = 0, minStock = 0 } = req.body;
    const data = {
      sku,
      name,
      cost: new Prisma.Decimal(cost),
      price: new Prisma.Decimal(price),
      stock: new Prisma.Decimal(stock),
      minStock: new Prisma.Decimal(minStock),
    };
    if (data.cost.lt(0) || data.price.lt(0) || data.stock.lt(0) || data.minStock.lt(0)) {
      return res.status(400).json({ error: "Valores negativos no permitidos" });
    }
    const p = await prisma.product.create({ data });
    res.json(p);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

//Actualiza un producto
router.put("/:id", verifyToken, requireRole?.("ADMIN") ?? ((_, __, next)=>next()), async (req, res) => {
  try {
    const { id } = req.params;
    const data = {};
    for (const k of ["sku","name"]) if (req.body[k] !== undefined) data[k] = req.body[k];
    for (const k of ["cost","price","stock","minStock"]) {
      if (req.body[k] !== undefined) {
        const val = new Prisma.Decimal(req.body[k]);
        if (val.lt(0)) return res.status(400).json({ error: `${k} no puede ser negativo` });
        data[k] = val;
      }
    }
    const p = await prisma.product.update({ where: { id }, data });
    res.json(p);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Cambia el estado activo/inactivo de un producto
router.patch("/:id/status", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;
    if (typeof active !== "boolean") {
      return res.status(400).json({ error: "Campo 'active' inválido" });
    }

    // regla de negocio: no permitir desactivar con stock > 0
    const p = await prisma.product.findUnique({ where: { id } });
     if (!p) return res.status(404).json({ error: "No encontrado" });
     if (!active && p.stock.gt ? p.stock.gt(0) : p.stock > 0) {
       return res.status(409).json({ error: "No se puede desactivar con stock > 0" });
     }

    const updated = await prisma.product.update({
      where: { id },
      data: { active }
    });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Elimina (desactiva) un producto
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.update({ where: { id }, data: { active: false } });
    res.json({ ok: true, message: "Producto desactivado" });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});


export default router;j
