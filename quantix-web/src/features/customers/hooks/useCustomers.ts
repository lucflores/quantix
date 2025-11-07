import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  disableCustomer,
  enableCustomer,
} from "../api";
import type { Customer, CreateCustomerDto, UpdateCustomerDto } from "../types";
import { useAuthStore } from "@/features/auth/hooks/useAuthStore";
import { toast } from "sonner";

export const useCustomers = () => {
  const token = useAuthStore((s) => s.token);

  return useQuery<Customer[]>({
    queryKey: ["customers", !!token],     // 🔑 refetch al cambiar presencia de token
    queryFn: getCustomers,
    enabled: !!token,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 60_000,
    placeholderData: (prev) => prev ?? [], // ✅ regla v5 (sin initialData)
  });
};

export const useCreateCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateCustomerDto) => createCustomer(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Cliente creado");
    },
  });
};

export const useUpdateCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCustomerDto }) =>
      updateCustomer(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Cliente actualizado");
    },
  });
};

export const useDisableCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => disableCustomer(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Cliente desactivado");
    },
  });
};

export const useEnableCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => enableCustomer(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Cliente activado");
    },
  });
};
