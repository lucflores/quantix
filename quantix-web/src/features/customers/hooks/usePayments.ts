import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/core/api/client";
import { toast } from "sonner";

type AddPaymentDTO = {
  customerId: string;
  amount: number;
  method?: string;
  reference?: string;
};

export function useAddPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ customerId, amount, method, reference }: AddPaymentDTO) => {
      const { data } = await api.post(`/customers/${customerId}/payments`, {
        amount, method, reference,
      });
      return data;
    },
    onSuccess: (_data, vars) => {
      toast.success("Pago registrado"); // ✅ éxito en el hook
      qc.invalidateQueries({ queryKey: ["customers"] });
      qc.invalidateQueries({ queryKey: ["customer-activity", vars.customerId] });
      qc.invalidateQueries({ queryKey: ["customer-balance", vars.customerId] }); // ✅ refresca saldo en tabla
    },
  });
}
