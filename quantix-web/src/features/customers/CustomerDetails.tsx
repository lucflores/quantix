import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useCustomerActivity } from "./hooks/useCustomerActivity";
import { useAddPayment } from "./hooks/usePayments";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  customerId?: string;
  customerName?: string;
};

function formatARDateTime(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function balanceHeading(balanceNumber: number) {
  if (balanceNumber > 0) {
    // deuda
    return {
      label: "Saldo a pagar:",
      amountText: `$${balanceNumber.toFixed(2)}`,
      className: "text-error font-semibold",
    };
  }
  if (balanceNumber < 0) {
    // crédito
    return {
      label: "Saldo a favor:",
      amountText: `$${Math.abs(balanceNumber).toFixed(2)}`,
      className: "text-accent font-semibold",
    };
  }
  // en cero
  return {
    label: "Cuenta al día:",
    amountText: "$0.00",
    className: "text-foreground font-semibold",
  };
}

export function CustomerDetails({ open, onOpenChange, customerId, customerName }: Props) {
  const { data, isLoading } = useCustomerActivity(customerId);
  const { mutateAsync: addPayment, isPending } = useAddPayment();

  const balance = Number(data?.balance ?? 0);
  const [amount, setAmount] = useState<string>("");

  const pagar = async () => {
    try {
      if (!customerId) return;
      const n = Number(amount);
      if (!Number.isFinite(n) || n <= 0) {
        toast.error("Monto inválido");
        return;
      }
      await addPayment({ customerId, amount: n, method: "EFECTIVO" });
      setAmount("");
      // éxito lo muestra el hook
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.response?.data?.error || "No se pudo registrar el pago";
      toast.error(msg);
    }
  };

  const heading = balanceHeading(balance);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">Actividad de {customerName ?? "Cliente"}</DialogTitle>
        </DialogHeader>

        {/* Balance + pagar */}
        <div className="flex items-end gap-3 mb-6">
          <div className="text-lg">
            <span className="text-muted-foreground">{heading.label}</span>{" "}
            <span className={heading.className}>{heading.amountText}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Input
              type="number"
              placeholder="Monto a pagar"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-40 bg-input border-border"
              min="0.01"
              step="0.01"
            />
            <Button onClick={pagar} disabled={isPending || !customerId}>Pagar</Button>
          </div>
        </div>

        {/* Tabla de actividad (sin columna Descripción) */}
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  <TableHead key="h-fecha">Fecha</TableHead>,
                  <TableHead key="h-tipo">Tipo</TableHead>,
                  <TableHead key="h-venta">Venta</TableHead>,
                  <TableHead key="h-monto" className="text-right">Monto</TableHead>,
                ]}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  {[
                    <TableCell key="l" colSpan={4} className="text-center text-muted-foreground py-8">Cargando…</TableCell>,
                  ]}
                </TableRow>
              )}

              {!isLoading && (data?.items?.length ?? 0) === 0 && (
                <TableRow>
                  {[
                    <TableCell key="e" colSpan={4} className="text-center text-muted-foreground py-8">
                      Sin movimientos
                    </TableCell>,
                  ]}
                </TableRow>
              )}

              {(data?.items ?? []).map((it) => {
                const amt = Number(it.amount ?? 0);
                const isPayment = it.type === "PAYMENT";
                const amountAbs = Math.abs(amt);
                // Colores por tipo (monto siempre positivo)
                const amountClass = isPayment ? "text-accent font-medium" : "text-error font-medium";

                return (
                  <TableRow key={it.id} className="hover:bg-muted/30">
                    {[
                      <TableCell key="c-fecha" className="text-muted-foreground">{formatARDateTime(it.date)}</TableCell>,
                      <TableCell key="c-tipo" className="text-foreground">{isPayment ? "Pago" : "Venta"}</TableCell>,
                      <TableCell key="c-venta" className="text-foreground">{it.saleNumber ?? "—"}</TableCell>,
                      <TableCell key="c-monto" className="text-right">
                        <span className={amountClass}>${amountAbs.toFixed(2)}</span>
                      </TableCell>,
                    ]}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
