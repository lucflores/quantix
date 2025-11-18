import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  disableSupplier,
  enableSupplier,
  getSupplierActivity
} from '../api'; 
import { api } from '@/core/api/client'; 
import type { CreateSupplierDto, UpdateSupplierDto } from '../types';

export const useSuppliers = () => { 
  return useQuery({
    queryKey: ['suppliers'], 
    queryFn: getSuppliers, 
  });
};

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateSupplierDto) => createSupplier(dto),
    onSuccess: () => {
      toast.success("Proveedor creado");
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string, dto: UpdateSupplierDto }) => 
      updateSupplier(id, dto),
    onSuccess: (_, { id }) => {
      toast.success("Proveedor actualizado");
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['supplier-activity', id] });
    },
  });
};

export const useDisableSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => disableSupplier(id),
    onSuccess: () => {
      toast.success("Proveedor desactivado");
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
};

export const useEnableSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => enableSupplier(id),
    onSuccess: () => {
      toast.success("Proveedor activado");
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
};

export const useSupplierActivity = (supplierId?: string) => {
  return useQuery({
    queryKey: ['supplier-activity', supplierId],
    enabled: !!supplierId,
    queryFn: async () => {
      const { data } = await api.get(`/suppliers/${supplierId}/activity`); 
      return data;
    },
  });
}