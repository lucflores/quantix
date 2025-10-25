import { api } from "../../../core/api/client";
import type { Product } from "../types";

export async function fetchProducts(): Promise<Product[]> {
  const { data } = await api.get("/products");
  console.log("respuesta del backend /products:", data);
  return data.items || []; // 👈 acá está la magia
}
