import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  disableCustomer,
  enableCustomer,
  addCustomerPayment
} from '../api'; 
import { api } from '@/core/api/client'; 
import type { CreateCustomerDto, UpdateCustomerDto } from '../types';

export const useCustomers = (
  page: number, 
  limit: number, 
  query: string
) => {
  return useQuery({
    queryKey: ['customers', page, limit, query], 
    queryFn: () => getCustomers(page, limit, query),
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateCustomerDto) => createCustomer(dto),
    onSuccess: () => {
      toast.success("Cliente creado");
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string, dto: UpdateCustomerDto }) => 
      updateCustomer(id, dto),
    onSuccess: (_, { id }) => {
      toast.success("Cliente actualizado");
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer-balance', id] }); 
      queryClient.invalidateQueries({ queryKey: ['customer-activity', id] });
    },
  });
};

export const useDisableCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => disableCustomer(id),
    onSuccess: () => {
      toast.success("Cliente desactivado");
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

export const useEnableCustomer = () => { 
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => enableCustomer(id),
    onSuccess: () => {
      toast.success("Cliente activado");
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

export function useCustomerBalance(customerId?: string) {
  return useQuery({
    queryKey: ["customer-balance", customerId],
    enabled: !!customerId,
    queryFn: async () => {
      const { data } = await api.get(`/customers/${customerId}/balance`); 
      const raw = (data?.balance ?? data) as unknown;
      const n = Number(raw ?? 0);
      return Number.isFinite(n) ? n : 0;
    },
    staleTime: 30_000,
  });
}

export const useAddPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { customerId: string, amount: number, method?: string }) => 
      addCustomerPayment(vars.customerId, vars),
    onSuccess: (_, vars) => {
      toast.success("Pago registrado");
      queryClient.invalidateQueries({ queryKey: ['customer-activity', vars.customerId] });
      queryClient.invalidateQueries({ queryKey: ['customer-balance', vars.customerId] });
    },
  });
}

export const useCustomerActivity = (customerId?: string) => {
  return useQuery({
    queryKey: ['customer-activity', customerId],
    enabled: !!customerId,
    queryFn: async () => {
      const { data } = await api.get(`/customers/${customerId}/activity`); 
      return data;
    },
  });
}

export const useAllCustomers = () => {
  return useQuery({
    queryKey: ['customers', 'all'], 
    queryFn: async () => {
      const response = await getCustomers(1, 1000, '');
      return response.data; 
    },
  });
};