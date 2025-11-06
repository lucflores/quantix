import { useQuery } from "@tanstack/react-query";
import { fetchStock } from "../api/stock";
import type { Product } from "../types";

// Trae el stock (productos con su stock actual)
export const useStock = () => {
  return useQuery<Product[]>({
    queryKey: ["stock"],
    queryFn: fetchStock,
  });
};