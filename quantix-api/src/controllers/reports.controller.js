import prisma from '../lib/prisma.js'; 
import { Prisma } from '@prisma/client';

const toNum = (v) => {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  if (v && typeof v === "object" && typeof v.toString === "function") {
    const n = parseFloat(v.toString());
    return Number.isFinite(n) ? n : 0;
  }
  const n = parseFloat(String(v ?? "0"));
  return Number.isFinite(n) ? n : 0;
};

export async function lowStock(req, res, next) {
  try {
    const page = Math.max(parseInt(String(req.query.page || "1"), 10), 1);
    const limit = Math.min(Math.max(parseInt(String(req.query.limit || "20"), 10), 1), 100);
    const offset = (page - 1) * limit;

    const rows = await prisma.product.findMany({
      where: { active: true },
      select: { id: true, sku: true, name: true, stock: true, minStock: true },
    });

    const computed = rows
      .map((p) => {
        const stock = toNum(p.stock);
        const min   = toNum(p.minStock);
        const shortage = +(min - stock).toFixed(2);
        return {
          id: p.id,
          sku: p.sku,
          name: p.name,
          stockNum: stock,
          minNum: min,
          shortageNum: shortage,
          stock: stock.toFixed(2),
          minStock: min.toFixed(2),
          shortage: shortage.toFixed(2),
        };
      })
      .filter((p) => p.stockNum <= p.minNum)
      .sort((a, b) => (b.shortageNum !== a.shortageNum
        ? b.shortageNum - a.shortageNum
        : a.name.localeCompare(b.name)));

    const total = computed.length;
    const items = computed.slice(offset, offset + limit)
      .map(({ stockNum, minNum, shortageNum, ...rest }) => rest);

    res.json({ page, limit, total, items });
  } catch (err) {
    console.error("❌ /reports/low-stock error:", err);
    next(err);
  }
}

export async function recentPurchases(req, res, next) {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const items = await prisma.purchase.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      include: {
        supplierRel: {
          select: { name: true },
        },
        items: {
          select: {
            id: true,
            quantity: true,
            unitCost: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });
    
    const itemsWithTotal = items.map(purchase => {
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

    res.json({ items: itemsWithTotal });
    
  } catch (err) {
    console.error("❌ /reports/recent-purchases error:", err);
    next(err);
  }
}

export async function recentSales(req, res, next) {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const items = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      include: {
        customerRel: {
          select: { name: true },
        },
        items: {
          select: {
            id: true,
            quantity: true,
            unitPrice: true, 
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    const itemsWithTotal = items.map(sale => {
      const totalAmount = sale.items.reduce((total, item) => {
        const quantity = new Prisma.Decimal(item.quantity);
        const unitPrice = new Prisma.Decimal(item.unitPrice); 
        return total.add(quantity.times(unitPrice)); 
      }, new Prisma.Decimal(0));

      return {
        ...sale,
        totalAmount: totalAmount.toFixed(2),
      };
    });

    res.json({ items: itemsWithTotal });
    
  } catch (err) {
    console.error("❌ /reports/recent-sales error:", err);
    next(err);
  }
}