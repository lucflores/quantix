import { api } from "../../../core/api/client";
import type { Product } from "../types";

// GET /api/v1/products → lista de productos con stock
export async function fetchStock(): Promise<Product[]> {
  const { data } = await api.get("/products");
  // Si el backend devuelve { data: [...] } o { products: [...] }
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.products)) return data.products;
  return [];
}

