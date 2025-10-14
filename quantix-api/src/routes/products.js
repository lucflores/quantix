import express from "express";
import { prisma } from "../lib/prisma.js";
import { verifyToken } from "../middleware/auth.js";
import { can } from "../middleware/authz.js"; // hoy no limita si AUTHZ=off
import { Prisma } from "@prisma/client";

const router = express.Router();

const d2 = (v) =>
  v instanceof Prisma.Decimal ? v.toFixed(2) : new Prisma.Decimal(v ?? 0).toFixed(2);

const serializeProduct = (p) => ({
  ...p,
  cost: d2(p.cost),
  price: d2(p.price),
  stock: d2(p.stock),
  minStock: d2(p.minStock),
});

// GET /api/v1/products?q=&page=&limit=&includeInactive=1
router.get("/", verifyToken, async (req, res) => {
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
    items: items.map(serializeProduct),
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
    limit,
    q,
    includeInactive,
  });
});

// POST /api/v1/products  (201)
router.post("/", verifyToken, can("product:create"), async (req, res) => {
  try {
    const { sku, name, cost, price } = req.body;
    const minStock = req.body.minStock ?? 0;

    if (!sku || !name) {
      return res.status(400).json({ error: "sku y name son obligatorios" });
    }

    // Coerción/validación de decimales
    const costD = new Prisma.Decimal(cost);
    const priceD = new Prisma.Decimal(price);
    const minStockD = new Prisma.Decimal(minStock);
    if (costD.lt(0) || priceD.lt(0) || minStockD.lt(0)) {
      return res.status(400).json({ error: "Valores negativos no permitidos" });
    }

    const created = await prisma.product.create({
      data: {
        sku,
        name,
        cost: costD,
        price: priceD,
        stock: new Prisma.Decimal(0), // stock no se toca acá (solo por compras/ventas/movements)
        minStock: minStockD,
        active: true, // por si en Prisma no hay @default(true)
      },
    });

    return res.status(201).json(serializeProduct(created));
  } catch (e) {
    // SKU único duplicado
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return res.status(409).json({ error: "SKU ya existe" });
    }
    return res.status(400).json({ error: e.message });
  }
});

// PUT /api/v1/products/:id  (actualiza, 200 OK)
router.put("/:id", verifyToken, can("product:update"), async (req, res) => {
  try {
    const { id } = req.params;
    const data = {};

    // Texto
    for (const k of ["sku", "name"]) {
      if (req.body[k] !== undefined) data[k] = req.body[k];
    }

    // Decimales (sin stock)
    for (const k of ["cost", "price", "minStock"]) {
      if (req.body[k] !== undefined) {
        const val = new Prisma.Decimal(req.body[k]);
        if (val.lt(0)) {
          return res.status(400).json({ error: `${k} no puede ser negativo` });
        }
        data[k] = val;
      }
    }

    const updated = await prisma.product.update({ where: { id }, data });
    res.json(serializeProduct(updated));
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return res.status(409).json({ error: "SKU ya existe" });
    }
    return res.status(400).json({ error: e.message });
  }
});

// PATCH /api/v1/products/:id/status  (activar/desactivar, 200 OK)
// Regla: no se puede desactivar si stock > 0
router.patch("/:id/status", verifyToken, can("product:status"), async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    if (typeof active !== "boolean") {
      return res.status(400).json({ error: "Campo 'active' inválido" });
    }

    const p = await prisma.product.findUnique({ where: { id } });
    if (!p) return res.status(404).json({ error: "No encontrado" });

    const stockD = p.stock instanceof Prisma.Decimal ? p.stock : new Prisma.Decimal(p.stock);
    if (!active && stockD.gt(0)) {
      return res.status(409).json({ error: "No se puede desactivar con stock > 0" });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: { active },
    });

    res.json(serializeProduct(updated));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE /api/v1/products/:id  (soft delete → desactivar, 200)
router.delete("/:id", verifyToken, can("product:status"), async (req, res) => {
  try {
    const { id } = req.params;

    const p = await prisma.product.findUnique({ where: { id } });
    if (!p) return res.status(404).json({ error: "No encontrado" });

    const stockD = p.stock instanceof Prisma.Decimal ? p.stock : new Prisma.Decimal(p.stock);
    if (stockD.gt(0)) {
      return res.status(409).json({ error: "No se puede desactivar con stock > 0" });
    }

    await prisma.product.update({ where: { id }, data: { active: false } });
    res.json({ ok: true, message: "Producto desactivado" });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
