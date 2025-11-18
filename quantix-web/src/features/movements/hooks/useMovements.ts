import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/hooks/useAuthStore";

export const useMovements = () => {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ["movements"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3001/api/v1/movements", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const raw = await res.json();

      return Array.isArray(raw)
        ? raw.map((m: any) => ({
            id: m.id,
            kind: m.kind,
            quantity: Number(m.quantity) || 0,
            createdAt: m.createdAt,
            productName: m.product?.name ?? "—",
            userName: m.createdBy?.name ?? m.createdById ?? "—",
          }))
        : [];
    },
  });
};
