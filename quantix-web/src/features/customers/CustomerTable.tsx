import { memo, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit, Eye, Power, Loader2 } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { useCustomerBalance } from "./hooks/useCustomers"; 
import type { Customer, CustomersResponse } from "./types";


const Row = memo(function Row({
  c, onView, onEdit, onToggleActive,
}: { c: Customer; onView: (c: Customer) => void; onEdit: (c: Customer) => void; onToggleActive: (id: string, active: boolean) => Promise<void> | void }) {
  const { data: balance, isLoading } = useCustomerBalance(c.id);
  const [toggling, setToggling] = useState(false);
  const {
    amountText: saldoAmount,
    amountClass: saldoClass,
  } = useMemo(() => {
    if (isLoading) {
      return { amountText: "—", amountClass: "text-muted-foreground" };
    }
    const v = Number(balance ?? 0);
    const abs = Math.abs(v).toFixed(2);

    if (v > 0) {
      return {
        amountText: `$${abs}`,
        amountClass: "text-error font-semibold",
      };
    }
    if (v < 0) {
      return {
        amountText: `$${abs}`,
        amountClass: "text-accent font-semibold",
      };
    }
    return {
      amountText: "$0.00",
      amountClass: "text-muted-foreground font-semibold",
    };
  }, [balance, isLoading]);

  const toggle = async () => {
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
      
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          ) : (
             <span className={saldoClass}>{saldoAmount}</span>
          )}
        </div>
      </TableCell>
      
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

type Props = {
  data: CustomersResponse | undefined;
  isLoading: boolean;
  search: string;
  onView: (c: Customer) => void;
  onEdit: (c: Customer) => void;
  onToggleActive: (id: string, active: boolean) => Promise<void> | void;
};

export const CustomerTable = ({ data, isLoading, search, onView, onEdit, onToggleActive }: Props) => {
  
  const customers = data?.data ?? [];
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
                <Loader2 className="w-5 h-5 inline animate-spin mr-2" />
                Cargando...
              </TableCell>
            </TableRow>
          )}

          {!isLoading && filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                {search ? "No se encontraron clientes" : "Sin clientes"}
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