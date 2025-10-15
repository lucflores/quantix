import { prisma } from "../lib/prisma.js";

const toNum = (v) => {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  if (v && typeof v === "object" && typeof v.toString === "function") {
    const n = parseFloat(v.toString());
    return Number.isFinite(n) ? n : 0;
  }
  const n = parseFloat(String(v ?? "0"));
  return Number.isFinite(n) ? n : 0;
};

/**
 * GET /api/v1/reports/low-stock?page=&limit=
 */
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
