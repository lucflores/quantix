import { api } from "@/core/api/client";
import type { Product } from "./types";

export type GetProductsParams = { q?: string; page?: number; limit?: number };

export async function getProducts(params: GetProductsParams = {}) {
  const { data } = await api.get("/products", { params });
  // Soporta ambos shapes: array directo o { items, total }
  const items = Array.isArray(data) ? data : data?.items;
  return (items ?? []) as Product[];
}
