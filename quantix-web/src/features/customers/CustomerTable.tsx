import { memo, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/core/api/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit, Eye, Power } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useCustomers } from "./hooks/useCustomers";
import type { Customer } from "./types";
import { toast } from "sonner";

// --- saldo (acepta decimal plano o { balance })
function useCustomerBalance(customerId?: string) {
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

type Props = {
  search: string;
  onView: (c: Customer) => void;
  onEdit: (c: Customer) => void;
  onToggleActive: (id: string, active: boolean) => Promise<void> | void;
};

const Row = memo(function Row({
  c, onView, onEdit, onToggleActive,
}: { c: Customer; onView: (c: Customer) => void; onEdit: (c: Customer) => void; onToggleActive: (id: string, active: boolean) => Promise<void> | void }) {
  const { data: balance, isLoading } = useCustomerBalance(c.id);
  const [toggling, setToggling] = useState(false);

  const {
    label: saldoLabel,
    amountText: saldoAmount,
    amountClass: saldoClass,
  } = useMemo(() => {
    if (isLoading) {
      return { label: "—", amountText: "—", amountClass: "text-muted-foreground" };
    }
    const v = Number(balance ?? 0);
    const abs = Math.abs(v).toFixed(2);

    if (v > 0) {
      // deuda
      return {
        label: "A pagar",
        amountText: `$${abs}`,
        amountClass: "text-error font-semibold",
      };
    }
    if (v < 0) {
      // crédito
      return {
        label: "A favor",
        amountText: `$${abs}`,
        amountClass: "text-accent font-semibold",
      };
    }
    // en cero
    return {
      label: "Al día",
      amountText: "$0.00",
      amountClass: "text-foreground font-semibold",
    };
  }, [balance, isLoading]);

  const toggle = async () => {
    // 🛑 Bloqueo front: no permitir desactivar si hay saldo (deuda o crédito)
    if (c.active && (balance ?? 0) !== 0) {
      toast.error("No se puede desactivar: tiene movimientos pendientes (saldo distinto de $0)");
      return;
    }
    setToggling(true);
    try { await onToggleActive(c.id, c.active); }
    finally { setToggling(false); }
  };

  return (
    <TableRow className="hover:bg-muted/30">
      <TableCell className="font-medium text-foreground">{c.name}</TableCell>
      <TableCell className="text-muted-foreground">{c.email ?? <Badge variant="outline">—</Badge>}</TableCell>
      <TableCell className="text-muted-foreground">{c.phone ?? <Badge variant="outline">—</Badge>}</TableCell>

      {/* saldo (chip + monto en valor absoluto) */}
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Badge
            variant="outline"
            className={
              saldoLabel === "A pagar"
                ? "border-error/30 text-error"
                : saldoLabel === "A favor"
                ? "border-accent/30 text-accent"
                : "text-muted-foreground"
            }
          >
            {saldoLabel}
          </Badge>
          <span className={saldoClass}>{saldoAmount}</span>
        </div>
      </TableCell>

      {/* estado */}
      <TableCell className="text-center">
        <Badge
          variant={c.active ? "default" : "outline"}
          className={
            c.active
              ? "bg-accent/20 text-accent border-accent/30 hover:bg-accent/30"
              : "bg-error/10 text-error border-error/30 hover:bg-error/20"
          }
        >
          {c.active ? "Activo" : "Inactivo"}
        </Badge>
      </TableCell>

      {/* acciones */}
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="text-accent hover:text-accent hover:bg-accent/10" onClick={() => onView(c)}>
                  <Eye className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Ver detalles</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="text-accent hover:text-accent hover:bg-accent/10" onClick={() => onEdit(c)}>
                  <Edit className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Editar</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={toggling}
                  className="text-muted-foreground hover:text-muted-foreground hover:bg-muted/50"
                  onClick={toggle}
                >
                  <Power className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{c.active ? "Desactivar" : "Activar"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
    </TableRow>
  );
});

export const CustomerTable = ({ search, onView, onEdit, onToggleActive }: Props) => {
  const { data: customers = [], isLoading } = useCustomers();

  const filtered = useMemo(() => {
    const q = (search ?? "").toLowerCase();
    if (!q) return customers;
    return customers.filter((c) =>
      (c.name ?? "").toLowerCase().includes(q) ||
      (c.email ?? "").toLowerCase().includes(q) ||
      (c.phone ?? "").toLowerCase().includes(q)
    );
  }, [customers, search]);

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="text-foreground font-semibold">Nombre</TableHead>
            <TableHead className="text-foreground font-semibold">Email</TableHead>
            <TableHead className="text-foreground font-semibold">Teléfono</TableHead>
            <TableHead className="text-foreground font-semibold text-right">Saldo</TableHead>
            <TableHead className="text-foreground font-semibold text-center">Estado</TableHead>
            <TableHead className="text-foreground font-semibold text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                Cargando…
              </TableCell>
            </TableRow>
          )}

          {!isLoading && filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                Sin clientes
              </TableCell>
            </TableRow>
          )}

          {filtered.map((c) => (
            <Row key={c.id} c={c as Customer} onView={onView} onEdit={onEdit} onToggleActive={onToggleActive} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
