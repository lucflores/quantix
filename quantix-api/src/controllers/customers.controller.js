import { prisma } from "../lib/prisma.js";
import { Prisma } from "@prisma/client";

// helper para decimales "xx.xx"
const d2 = (v) =>
  v instanceof Prisma.Decimal ? v.toFixed(2) : new Prisma.Decimal(v ?? 0).toFixed(2);

/** GET /api/v1/customers?q= */
export async function listCustomers(req, res, next) {
  try {
    const q = (req.query.q || "").toString().trim();
    const where = q
      ? { name: { contains: q, mode: "insensitive" } }
      : undefined;

    const items = await prisma.customer.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    res.json({ items });
  } catch (err) {
    next(err);
  }
}

/** POST /api/v1/customers  body: { name, email?, phone? } */
export async function createCustomer(req, res, next) {
  try {
    const { name, email, phone } = req.body || {};
    if (!name) return res.status(400).json({ error: "name es obligatorio" });

    const data = { name, active: true };
    if (email) data.email = String(email).trim().toLowerCase();
    if (phone) data.phone = String(phone).trim();

    const created = await prisma.customer.create({ data });
    res.status(201).json(created);
  } catch (err) {
    if (err?.code === "P2002") return res.status(409).json({ error: "email ya registrado" });
    next(err);
  }
}

/** PATCH/PUT /api/v1/customers/:id */
export async function updateCustomer(req, res, next) {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body || {};
    if (!name) return res.status(400).json({ error: "name es obligatorio" });

    const data = { name };
    if (email !== undefined) data.email = email ? String(email).trim().toLowerCase() : null;
    if (phone !== undefined) data.phone = phone ? String(phone).trim() : null;

    const updated = await prisma.customer.update({ where: { id }, data });
    return res.json(updated);
  } catch (err) {
    if (err?.code === "P2025") return res.status(404).json({ error: "Cliente no encontrado" });
    if (err?.code === "P2002") return res.status(409).json({ error: "email ya registrado" });
    next(err);
  }
}

/** DELETE /api/v1/customers/:id */
export async function deleteCustomer(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.customer.delete({ where: { id } });
    return res.status(204).end();
  } catch (err) {
    if (err?.code === "P2025") return res.status(404).json({ error: "Cliente no encontrado" });
    next(err);
  }
}

/** PATCH /api/v1/customers/:id/disable */
export async function disableCustomer(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await prisma.customer.update({ where: { id }, data: { active: false } });
    res.json(updated);
  } catch (err) {
    if (err?.code === "P2025") return res.status(404).json({ error: "Cliente no encontrado" });
    next(err);
  }
}

/** PATCH /api/v1/customers/:id/enable */
export async function enableCustomer(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await prisma.customer.update({ where: { id }, data: { active: true } });
    res.json(updated);
  } catch (err) {
    if (err?.code === "P2025") return res.status(404).json({ error: "Cliente no encontrado" });
    next(err);
  }
}

/** GET /api/v1/customers/:id/balance */
export async function getCustomerBalance(req, res, next) {
  try {
    const { id } = req.params;

    const [salesAgg] = await prisma.$queryRaw`
      SELECT COALESCE(SUM(si."quantity" * si."unitPrice"), 0)::DECIMAL(12,2) AS total
      FROM "Sale" s
      JOIN "SaleItem" si ON si."saleId" = s.id
      WHERE s."customerId" = ${id} AND s.payment = 'CTA_CTE'
    `;
    const [paymentsAgg] = await prisma.$queryRaw`
      SELECT COALESCE(SUM(p.amount), 0)::DECIMAL(12,2) AS total
      FROM "Payment" p
      WHERE p."customerId" = ${id}
    `;

    const balance = new Prisma.Decimal(salesAgg?.total ?? 0).sub(
      new Prisma.Decimal(paymentsAgg?.total ?? 0)
    );

    return res.json({ balance: d2(balance) });
  } catch (err) {
    next(err);
  }
}

/** POST /api/v1/customers/:id/payments  body: { amount, method?, reference? } */
export async function addCustomerPayment(req, res, next) {
  try {
    const { id } = req.params;
    const { amount, method, reference } = req.body || {};
    if (amount === undefined) return res.status(400).json({ error: "amount es obligatorio" });

    const amt = new Prisma.Decimal(amount);
    if (amt.lte(0)) return res.status(400).json({ error: "amount debe ser > 0" });

    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) return res.status(404).json({ error: "Cliente no encontrado" });

    const created = await prisma.payment.create({
      data: {
        customerId: id,
        amount: amt,
        method: method ?? null,
        reference: reference ?? null,
        createdById: req.user.id,
      },
    });

    return res.status(201).json({ ...created, amount: d2(created.amount) });
  } catch (err) {
    next(err);
  }
}

/** GET /api/v1/customers/:id/activity  (ventas + pagos + saldo) */
export async function getCustomerActivity(req, res, next) {
  try {
    const { id } = req.params;

    // Ventas con total por venta
    const sales = await prisma.$queryRaw`
      SELECT s.id, s."createdAt" as date, 'SALE' as kind,
             COALESCE(SUM(si."quantity" * si."unitPrice"), 0)::DECIMAL(12,2) as amount,
             s.payment, s."customerId"
      FROM "Sale" s
      JOIN "SaleItem" si ON si."saleId" = s.id
      WHERE s."customerId" = ${id}
      GROUP BY s.id
      ORDER BY s."createdAt" DESC
      LIMIT 50
    `;

    // Pagos
    const payments = await prisma.$queryRaw`
      SELECT p.id, p."createdAt" as date, 'PAYMENT' as kind,
             p.amount::DECIMAL(12,2) as amount,
             p.method, p."customerId"
      FROM "Payment" p
      WHERE p."customerId" = ${id}
      ORDER BY p."createdAt" DESC
      LIMIT 50
    `;

    // Saldo actual
    const [salesAgg] = await prisma.$queryRaw`
      SELECT COALESCE(SUM(si."quantity" * si."unitPrice"), 0)::DECIMAL(12,2) AS total
      FROM "Sale" s
      JOIN "SaleItem" si ON si."saleId" = s.id
      WHERE s."customerId" = ${id} AND s.payment = 'CTA_CTE'
    `;
    const [paymentsAgg] = await prisma.$queryRaw`
      SELECT COALESCE(SUM(p.amount), 0)::DECIMAL(12,2) AS total
      FROM "Payment" p
      WHERE p."customerId" = ${id}
    `;

    const balance = new Prisma.Decimal(salesAgg?.total ?? 0).sub(
      new Prisma.Decimal(paymentsAgg?.total ?? 0)
    );

    const items = [...sales, ...payments]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 50);

    return res.json({ balance: d2(balance), items });
  } catch (err) {
    next(err);
  }
}
