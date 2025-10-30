import { Prisma } from '@prisma/client';

export const DEFAULT_STEP = {
  UNIT: '1.000',
  KG:   '0.001',
  LT:   '0.001',
  M:    '0.001',
};

export const D = (v) => new Prisma.Decimal(v ?? 0);
export const nonNeg = (d) => !d.isNaN() && d.gte(0);
export const isMultipleOf = (value, step) => (step.eq(0) ? true : value.div(step).isInteger());

export const decToNumber = (v) =>
  (v && typeof v.toNumber === 'function') ? v.toNumber() : Number(v ?? 0);

export const serializeProduct = (p) => ({
  id: p.id,
  sku: p.sku,
  name: p.name,
  unit: p.unit,
  step: decToNumber(p.step),
  price: decToNumber(p.price),
  cost: decToNumber(p.cost),
  stock: decToNumber(p.stock),
  minStock: decToNumber(p.minStock),
  active: Boolean(p.active),
  createdAt: p.createdAt,
  updatedAt: p.updatedAt,
});
