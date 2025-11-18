import { api } from "@/core/api/client"; 
import type { Purchase, CreatePurchaseDto, PurchasesResponse } from "./types";


export async function getPurchases(
  page: number = 1, 
  limit: number = 20, 
  q: string = ''
): Promise<PurchasesResponse> { 
  
  const { data } = await api.get<PurchasesResponse>("/purchases", {
    params: { page, limit, q } 
  });
  return data;
}

export async function createPurchase(dto: CreatePurchaseDto) {
  const { data } = await api.post("/purchases", dto);
  return data;
}

export async function getRecentPurchases(): Promise<Purchase[]> {
  const { data } = await api.get<PurchasesResponse | Purchase[]>("/reports/recent-purchases");

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}