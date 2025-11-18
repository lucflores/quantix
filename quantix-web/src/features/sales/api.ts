import { api } from "@/core/api/client";
import type { Sale, CreateSaleDto, SalesResponse } from "./types";

export async function getRecentSales(): Promise<Sale[]> {
  const { data } = await api.get<{ items: Sale[] } | Sale[]>("/reports/recent-sales");

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

export async function getSales(
  page: number = 1, 
  limit: number = 20, 
  q: string = ''
): Promise<SalesResponse> {
  
  const { data } = await api.get<SalesResponse>("/sales", {
    params: { page, limit, q }
  });
  
  return data;
}

export async function createSale(payload: CreateSaleDto) {
  const { data } = await api.post("/sales", payload);
  return data;
}