import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSale, getRecentSales } from "../api";
import { useAuthStore } from "@/features/auth/hooks/useAuthStore";

export function useRecentSales(limit = 10) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ["sales", "recent", limit],
    queryFn: () => getRecentSales(limit),
    enabled: !!token,         // ✅ espera a tener token
    staleTime: 30_000,
  });
}

export function useCreateSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sales"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
