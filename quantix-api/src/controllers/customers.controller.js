import { prisma } from "../lib/prisma.js";
import { Prisma } from "@prisma/client";

const d2 = (v) =>
  v instanceof Prisma.Decimal ? v.toFixed(2) : new Prisma.Decimal(v ?? 0).toFixed(2);

export async function listCustomers(req, res, next) {
  try {
    const { q, page, limit, mode } = req.query;
    if (mode === "list") {
      const items = await prisma.customer.findMany({
        where: { active: true },
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
        },
      });
      return res.json({ items });
    }

    const pageNum = Math.max(parseInt(String(page || "1"), 10), 1);
    const limitNum = Math.min(Math.max(parseInt(String(limit || "20"), 10), 1), 100);
    const skip = (pageNum - 1) * limitNum;
    const query = (q || "").toString().trim();

    const where = query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { phone: { contains: query, mode: "insensitive" } },
            { address: { contains: query, mode: "insensitive" } },
          ],
        }
      : {};

    const items = await prisma.customer.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.customer.count({ where });

    res.json({
      data: items,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      totalResults: total,
    });
  } catch (err) {
    next(err);
  }
}

export async function createCustomer(req, res, next) {
  try {
    const { name, email, phone, address } = req.body || {};
    if (!name) return res.status(400).json({ error: "name es obligatorio" });

    const data = { name, active: true };

    if (email) data.email = String(email).trim().toLowerCase();
    if (phone) data.phone = String(phone).trim();
    if (address) data.address = String(address).trim();

    const created = await prisma.customer.create({ data });
    res.status(201).json(created);
  } catch (err) {
    if (err?.code === "P2002") return res.status(409).json({ error: "email ya registrado" });
    next(err);
  }
}

export async function updateCustomer(req, res, next) {
  try {
    const { id } = req.params;
    const { name, email, phone, address } = req.body || {};
    if (!name) return res.status(400).json({ error: "name es obligatorio" });

    const data = { name };

    if (email !== undefined) data.email = email ? String(email).trim().toLowerCase() : null;
    if (phone !== undefined) data.phone = phone ? String(phone).trim() : null;
    if (address !== undefined) data.address = address ? String(address).trim() : null;

    const updated = await prisma.customer.update({ where: { id }, data });
    return res.json(updated);
  } catch (err) {
    if (err?.code === "P2025") return res.status(404).json({ error: "Cliente no encontrado" });
    if (err?.code === "P2002") return res.status(409).json({ error: "email ya registrado" });
    next(err);
  }
}

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

export async function disableCustomer(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await prisma.customer.update({
      where: { id },
      data: { active: false },
    });
    res.json(updated);
  } catch (err) {
    if (err?.code === "P2025") return res.status(404).json({ error: "Cliente no encontrado" });
    next(err);
  }
}

export async function enableCustomer(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await prisma.customer.update({
      where: { id },
      data: { active: true },
    });
    res.json(updated);
  } catch (err) {
    if (err?.code === "P2025") return res.status(404).json({ error: "Cliente no encontrado" });
    next(err);
  }
}

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

export async function getCustomerActivity(req, res, next) {
  try {
    const { id } = req.params;

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

    const payments = await prisma.$queryRaw`
      SELECT p.id, p."createdAt" as date, 'PAYMENT' as kind,
             p.amount::DECIMAL(12,2) as amount,
             p.method, p."customerId"
      FROM "Payment" p
      WHERE p."customerId" = ${id}
      ORDER BY p."createdAt" DESC
      LIMIT 50
    `;

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
