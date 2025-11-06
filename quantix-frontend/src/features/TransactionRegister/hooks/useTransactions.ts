import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "../api/transaction";
import type { Transaction } from "../types";

export const useTransactions = () => {
  return useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  });
};
