import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  getRecentPurchases, 
  getPurchases,
  createPurchase 
} from '../api'; 
import type { CreatePurchaseDto } from '../types';

export const usePurchases = () => {
  return useQuery({
    queryKey: ['purchases_recent'],
    queryFn: getRecentPurchases,
  });
};

export const useCreatePurchase = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (dto: CreatePurchaseDto) => createPurchase(dto),
    onSuccess: () => {
      toast.success("Compra registrada exitosamente");
      queryClient.invalidateQueries({ queryKey: ['purchases_recent'] }); 
      queryClient.invalidateQueries({ queryKey: ['purchases_history'] }); 
      queryClient.invalidateQueries({ queryKey: ['products'] }); 
      queryClient.invalidateQueries({ queryKey: ['movements'] });
    },
  });
};

export const usePurchaseHistory = (
  page: number, 
  limit: number, 
  query: string
) => {
  return useQuery({
    queryKey: ['purchases_history', page, limit, query], 
    queryFn: () => getPurchases(page, limit, query),
  });
};