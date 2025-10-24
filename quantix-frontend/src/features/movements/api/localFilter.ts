import type { Movement, MovementsQuery } from "../types";

export function applyLocalFilters(data: Movement[], f: MovementsQuery) {
  let out = [...data];

  if (f.kind && f.kind !== "ALL") out = out.filter((m) => m.kind === f.kind);

  if (f.q && f.q.trim()) {
    const q = f.q.trim().toLowerCase();
    out = out.filter((m) => {
      const name = m.product?.name?.toLowerCase() ?? "";
      const sku = m.product?.sku?.toLowerCase() ?? "";
      return name.includes(q) || sku.includes(q);
    });
  }

  if (f.from) {
    const ts = new Date(f.from).getTime();
    out = out.filter((m) => new Date(m.createdAt).getTime() >= ts);
  }
  if (f.to) {
    const ts = new Date(f.to + "T23:59:59").getTime();
    out = out.filter((m) => new Date(m.createdAt).getTime() <= ts);
  }

  if (f.sort === "date_asc") {
    out.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
  } else {
    out.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }

  const pageSize = f.pageSize ?? 20;
  const page = f.page ?? 1;
  const total = out.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const rows = out.slice((page - 1) * pageSize, page * pageSize);

  return { rows, total, pages };
}
