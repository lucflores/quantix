import { useQuery } from "@tanstack/react-query";
import { getProducts, type GetProductsParams } from "../api";

export const useProducts = (params: GetProductsParams = {}) =>
  useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
    staleTime: 60_000,
  });
