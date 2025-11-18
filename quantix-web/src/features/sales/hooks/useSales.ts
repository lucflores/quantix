import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  getRecentSales,
  getSales,
  createSale 
} from '../api'; 
import type { CreateSaleDto } from '../types';

export const useSales = () => {
  return useQuery({
    queryKey: ['sales_recent'], 
    queryFn: getRecentSales,
  });
};

export const useCreateSale = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (dto: CreateSaleDto) => createSale(dto),
    
    onSuccess: () => {
      toast.success("Venta registrada exitosamente");
      queryClient.invalidateQueries({ queryKey: ['sales_recent'] }); 
      queryClient.invalidateQueries({ queryKey: ['sales_history'] }); 
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['movements'] });
      queryClient.invalidateQueries({ queryKey: ['customer-balance'] });
      queryClient.invalidateQueries({ queryKey: ['customer-activity'] });
    },
  });
};

export const useSalesHistory = (
  page: number, 
  limit: number, 
  query: string
) => {
  return useQuery({
    queryKey: ['sales_history', page, limit, query], 
    queryFn: () => getSales(page, limit, query),
  });
};