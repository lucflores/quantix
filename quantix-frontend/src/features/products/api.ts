import { api } from "../../core/api/client";

export interface Product {
  id: string;
  sku: string;
  name: string;
  cost: string;
  price: string;
  stock: string;
  minStock: string;
  active: boolean;
}

export async function getProducts(): Promise<Product[]> {
  const res = await api.get("/products");
  return res.data.items || res.data; 
}
