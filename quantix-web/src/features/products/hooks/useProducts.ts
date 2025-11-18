import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  toggleProductStatus 
} from '../api';
import type { CreateProductDto, UpdateProductDto } from '../types';

export const useProducts = (page: number, limit: number, search: string) => {
  return useQuery({
    queryKey: ['products', page, limit, search],
    queryFn: () => getProducts(page, limit, search),
  });
};

export const useAllProducts = () => {
  return useQuery({
    queryKey: ['products', 'all'], 
    queryFn: async () => {
      const response = await getProducts(1, 200, '');
      return response.data;
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateProductDto) => createProduct(dto),
    onSuccess: () => {
      toast.success("Producto creado correctamente");
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string, dto: UpdateProductDto }) => 
      updateProduct(id, dto),
    onSuccess: () => {
      toast.success("Producto actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useToggleProductStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: string, active: boolean }) => 
      toggleProductStatus(id, active),
    onSuccess: (_, variables) => {
      const action = variables.active ? "activado" : "desactivado";
      toast.success(`Producto ${action} correctamente`);
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err: any) => {
       const msg = err?.response?.data?.error || "No se pudo cambiar el estado";
       toast.error(msg);
    }
  });
};