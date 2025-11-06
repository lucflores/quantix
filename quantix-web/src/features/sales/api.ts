import { api } from "@/core/api/client";
import type { CreateSaleDto, Sale } from "./types";

export async function getRecentSales(limit = 10) {
  const { data } = await api.get<Sale[]>("/sales", { params: { limit } });
  return data;
}

export async function createSale(payload: CreateSaleDto) {
  const { data } = await api.post<Sale>("/sales", payload);
  return data;
}
