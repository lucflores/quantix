import { useQuery } from "@tanstack/react-query";
import { api } from "@/core/api/client";

export type ActivityItem = {
  id: string;
  type: "SALE" | "PAYMENT";
  date: string;
  description: string;
  amount: number;              // normalizado a número
  saleNumber?: string | number; // ⬅ nro de venta asociado si existe
};

export function useCustomerActivity(customerId?: string) {
  return useQuery<{ balance: number; items: ActivityItem[] }>({
    queryKey: ["customer-activity", customerId],
    enabled: !!customerId,
    queryFn: async () => {
      const { data } = await api.get(`/customers/${customerId}/activity`);

      // balance puede venir plano o dentro de { balance }
      const rawBalance = (data?.balance ?? data?.saldo ?? 0) as unknown;
      const balance = Number(rawBalance) || 0;

      // items puede venir en data.items o ser el propio data si ya es array
      const rawItems: any[] = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];

      const items: ActivityItem[] = rawItems.map((it: any, i: number) => {
        const amt = Number(it?.amount ?? it?.monto ?? 0);
        const inferredType: "SALE" | "PAYMENT" =
          (it?.type ?? it?.kind)?.toUpperCase?.() === "PAYMENT"
            ? "PAYMENT"
            : (it?.type ?? it?.kind)?.toUpperCase?.() === "SALE"
            ? "SALE"
            : amt < 0
            ? "PAYMENT"
            : "SALE";

        const saleNumber =
          it?.saleNumber ?? it?.sale_id ?? it?.saleId ?? it?.documentNumber ?? it?.nro ?? undefined;

        const date = it?.date ?? it?.createdAt ?? it?.fecha ?? new Date().toISOString();

        return {
          id: String(it?.id ?? `${inferredType}-${i}`),
          type: inferredType,
          date,
          description: it?.description ?? it?.notes ?? "",
          amount: Number.isFinite(amt) ? amt : 0,
          saleNumber,
        };
      });

      return { balance, items };
    },
    staleTime: 30_000,
    placeholderData: (prev) => prev ?? { balance: 0, items: [] },
  });
}
