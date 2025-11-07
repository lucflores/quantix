import { api } from "@/core/api/client";

export type PaymentMethod = "EFECTIVO" | "CTA_CTE";
export type Sale = {
  id: string;
  date: string;            // ISO de createdAt
  customerName?: string;
  total: number;           // calculado
  payment: PaymentMethod;
};

export async function getRecentSales(limit = 10): Promise<Sale[]> {
  const { data } = await api.get("/sales", { params: { limit } });
  const items = Array.isArray(data) ? data : data?.items || [];

  return items.map((s: any) => {
    // calcula total a partir de ítems
    const total = Array.isArray(s.items)
      ? s.items.reduce((acc: number, it: any) =>
          acc + Number(it.quantity) * Number(it.unitPrice), 0)
      : 0;

    return {
      id: s.id,
      date: s.createdAt ?? s.date ?? new Date().toISOString(),
      customerName: s.customerRel?.name ?? s.customer ?? "Público General",
      total,
      payment: s.payment ?? "EFECTIVO",
    };
  });
}

export async function createSale(payload: {
  payment: PaymentMethod;
  customerId?: string;
  items: Array<{ productId: string; quantity: number; unitPrice: number }>;
}) {
  const { data } = await api.post("/sales", payload);
  return data;
}
