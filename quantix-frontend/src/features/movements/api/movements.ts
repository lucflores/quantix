import { api } from "../../../core/api/client";
import type { Movement } from "../types";

// GET /api/v1/movements → últimos 100 con producto
export async function fetchLastMovements(): Promise<Movement[]> {
  const { data } = await api.get("/movements");
  return data as Movement[];
}
