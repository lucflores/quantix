import { api } from "../../../core/api/client";
import type { Transaction } from "../types";

// GET /api/v1/transactions → lista todas las transacciones
export async function fetchTransactions(): Promise<Transaction[]> {
  const { data } = await api.get("/transactions");
  return data as Transaction[];
}

// POST /api/v1/transactions → crea una nueva transacción
export async function createTransaction(newTx: Partial<Transaction>) {
  const { data } = await api.post("/transactions", newTx);
  return data;
}
