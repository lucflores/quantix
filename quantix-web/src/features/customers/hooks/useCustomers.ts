import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "../api";

export const useCustomers = () =>
  useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
    staleTime: 60_000,
  });
