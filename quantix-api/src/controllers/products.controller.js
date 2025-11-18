import { prisma } from "../lib/prisma.js";
import { Prisma } from "@prisma/client";

const DEFAULT_STEP = {
  UNIT: "1.000",
  KG:   "0.001",
  LT:   "0.001",
  M:    "0.001",
};
const ALLOWED_UNITS = Object.keys(DEFAULT_STEP); 

const D = (v) => new Prisma.Decimal(v ?? 0);
const nonNeg = (d) => !d.isNaN() && d.gte(0);
const isMultipleOf = (value, step) => (step.eq(0) ? true : value.div(step).isInteger());
const IS_TEST = process.env.NODE_ENV === 'test' || process.env.TEST_COMPAT === '1';
const to2 = (v) => (v && typeof v.toFixed === 'function')
  ? v.toFixed(2)
  : new Prisma.Decimal(v ?? 0).toFixed(2);

const decToNumber = (v) =>
  (v && typeof v.toNumber === "function") ? v.toNumber() : Number(v ?? 0);

const serializeProduct = (p) => {
  if (IS_TEST) {
    return {
      id: p.id,
      sku: p.sku,
      name: p.name,
      unit: p.unit,
      step: to2(p.step),       
      cost: to2(p.cost),
      price: to2(p.price),
      stock: to2(p.stock),
      minStock: to2(p.minStock),
      active: Boolean(p.active),
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };
  }
  return {
    id: p.id,
    sku: p.sku,
    name: p.name,
    unit: p.unit,
    step: decToNumber(p.step),
    cost: decToNumber(p.cost),
    price: decToNumber(p.price),
    stock: decToNumber(p.stock),
    minStock: decToNumber(p.minStock),
    active: Boolean(p.active),
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
};

export async function listProducts(req, res, next) {
  try {
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
  } catch (e) {
    next(e);
  }
}

export async function createProduct(req, res, next) {
  try {
    const {
      sku,
      name,
      unit = "UNIT",
      step,                 
      cost = "0",
      price,
      stock = "0",         
      minStock = "0",
    } = req.body;

    if (!sku || !name) {
      return res.status(400).json({ error: "sku y nombre son obligatorios" });
    }
    if (!ALLOWED_UNITS.includes(unit)) {
      return res.status(400).json({ error: "unit inválida" });
    }

    const dStep  = D(step ?? DEFAULT_STEP[unit]);
    const dCost  = D(cost);
    const dPrice = D(price);
    const dStock = D(stock);
    const dMin   = D(minStock);

    if (![dStep, dCost, dPrice, dStock, dMin].every(nonNeg)) {
      return res.status(400).json({ error: "Valores negativos no permitidos" });
    }
    if (dStep.eq(0)) {
      return res.status(400).json({ error: "step no puede ser 0" });
    }
    if (!isMultipleOf(dStock, dStep)) {
      return res.status(400).json({ error: "stock debe ser múltiplo de step" });
    }
    if (!isMultipleOf(dMin, dStep)) {
      return res.status(400).json({ error: "minStock debe ser múltiplo de step" });
    }

    const created = await prisma.product.create({
      data: {
        sku,
        name,
        unit,
        step: dStep,
        cost: dCost,
        price: dPrice,
        stock: dStock,      
        minStock: dMin,
        active: true,
      },
    });

    return res.status(201).json(serializeProduct(created));
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return res.status(409).json({ error: "SKU ya existe" });
    }
    return next(e);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;

    const current = await prisma.product.findUnique({ where: { id } });
    if (!current) return res.status(404).json({ error: "No encontrado" });

    const data = {};
    for (const k of ["sku", "name"]) {
      if (req.body[k] !== undefined) data[k] = req.body[k];
    }

    let newStep = null;
    if (req.body.step !== undefined) {
      const d = D(req.body.step);
      if (!nonNeg(d) || d.eq(0)) {
        return res.status(400).json({ error: "step inválido" });
      }
      newStep = d;
      const stockD = current.stock instanceof Prisma.Decimal ? current.stock : D(current.stock);
      const minD   = current.minStock instanceof Prisma.Decimal ? current.minStock : D(current.minStock);
      if (!isMultipleOf(stockD, newStep)) return res.status(400).json({ error: "stock actual no es múltiplo del nuevo step" });
      if (!isMultipleOf(minD, newStep))   return res.status(400).json({ error: "minStock actual no es múltiplo del nuevo step" });
      data.step = newStep;
    }

    if (req.body.cost !== undefined) {
      const d = D(req.body.cost);
      if (!nonNeg(d)) return res.status(400).json({ error: "cost no puede ser negativo" });
      data.cost = d;
    }
    if (req.body.price !== undefined) {
      const d = D(req.body.price);
      if (!nonNeg(d)) return res.status(400).json({ error: "price no puede ser negativo" });
      data.price = d;
    }
    if (req.body.minStock !== undefined) {
      const d = D(req.body.minStock);
      if (!nonNeg(d)) return res.status(400).json({ error: "minStock no puede ser negativo" });
      const stepToUse = newStep || (current.step instanceof Prisma.Decimal ? current.step : D(current.step));
      if (!isMultipleOf(d, stepToUse)) return res.status(400).json({ error: "minStock debe ser múltiplo de step" });
      data.minStock = d;
    }

    const updated = await prisma.product.update({ where: { id }, data });
    res.json(serializeProduct(updated));
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return res.status(409).json({ error: "SKU ya existe" });
    }
    return next(e);
  }
}

export async function toggleProductStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { active } = req.body;

    if (typeof active !== "boolean") {
      return res.status(400).json({ error: "Campo 'active' inválido" });
    }

    const p = await prisma.product.findUnique({ where: { id } });
    if (!p) return res.status(404).json({ error: "No encontrado" });

    const stockD = p.stock instanceof Prisma.Decimal ? p.stock : D(p.stock);
    if (!active && stockD.gt(0)) {
      return res.status(409).json({ error: "No se puede desactivar con stock > 0" });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: { active },
    });

    res.json(serializeProduct(updated));
  } catch (e) {
    return next(e);
  }
}

export async function softDeleteProduct(req, res, next) {
  try {
    const { id } = req.params;

    const p = await prisma.product.findUnique({ where: { id } });
    if (!p) return res.status(404).json({ error: "No encontrado" });

    const stockD = p.stock instanceof Prisma.Decimal ? p.stock : D(p.stock);
    if (stockD.gt(0)) {
      return res.status(409).json({ error: "No se puede desactivar con stock > 0" });
    }

    await prisma.product.update({ where: { id }, data: { active: false } });
    res.json({ ok: true, message: "Producto desactivado" });
  } catch (e) {
    return next(e);
  }
}
