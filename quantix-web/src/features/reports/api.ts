import { api } from "@/core/api/client";
import type { LowStockResponse } from "./types";

export async function getLowStockReport(
  page: number = 1,
  limit: number = 20
): Promise<LowStockResponse> {
  const { data } = await api.get<LowStockResponse>("/reports/low-stock", {
    params: { page, limit },
  });
  return data;
}