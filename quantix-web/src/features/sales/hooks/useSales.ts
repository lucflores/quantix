import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSale, getRecentSales } from "../api";
import { useAuthStore } from "@/features/auth/hooks/useAuthStore";

export function useRecentSales(limit = 10) {
  const token = useAuthStore(s => s.token);
  return useQuery({
    queryKey: ["sales", "recent", limit],
    queryFn: () => getRecentSales(limit),
    enabled: !!token,
    staleTime: 30_000,
  });
}

export function useCreateSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      // invalida cualquier ["sales","recent", *]
      qc.invalidateQueries({ predicate: q => Array.isArray(q.queryKey) && q.queryKey[0] === "sales" });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
