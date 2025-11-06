import { api } from "@/core/api/client";
import type { Customer } from "./types";

export async function getCustomers() {
  const { data } = await api.get("/customers");
  const items = Array.isArray(data) ? data : data?.items;
  return (items ?? []) as Customer[];
}
