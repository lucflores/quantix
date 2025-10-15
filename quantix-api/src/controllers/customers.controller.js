import { prisma } from "../lib/prisma.js";
import { Prisma } from "@prisma/client";

// helper: string "xx.xx"
const d2 = (v) =>
  v instanceof Prisma.Decimal ? v.toFixed(2) : new Prisma.Decimal(v ?? 0).toFixed(2);

/**
 * GET /api/v1/customers?q=
 */
export async function listCustomers(req, res, next) {
  try {
    const q = (req.query.q || "").toString().trim();
    const where = q
      ? { AND: [{ active: true }, { name: { contains: q, mode: "insensitive" } }] }
      : { active: true };

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

/**
 * POST /api/v1/customers
 * body: { name, email?, phone? }
 */
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
    if (err?.code === "P2002") {
      return res.status(409).json({ error: "email ya registrado" });
    }
    next(err);
  }
}

/**
 * GET /api/v1/customers/:id/balance
 * balance = SUM(ventas CTA_CTE) - SUM(pagos)
 */
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

    const sales = new Prisma.Decimal(salesAgg?.total ?? 0);
    const pays  = new Prisma.Decimal(paymentsAgg?.total ?? 0);
    const balance = sales.sub(pays);

    return res.json({ balance: d2(balance) }); // ej: "60.00"
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/customers/:id/payments
 * body: { amount, method?, reference? }
 */
export async function addCustomerPayment(req, res, next) {
  try {
    const { id } = req.params;
    const { amount, method, reference } = req.body || {};

    if (amount === undefined) {
      return res.status(400).json({ error: "amount es obligatorio" });
    }

    const amt = new Prisma.Decimal(amount);
    if (amt.lte(0)) {
      return res.status(400).json({ error: "amount debe ser > 0" });
    }

    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer || customer.active === false) {
      return res.status(404).json({ error: "Cliente no encontrado o inactivo" });
    }

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
