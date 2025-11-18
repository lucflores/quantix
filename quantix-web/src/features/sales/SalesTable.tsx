import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge"; 
import { useSales } from "./hooks/useSales";
import type { Sale } from "./types";

function formatARDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const calculateTotal = (sale: Sale): number => {
  if (sale.totalAmount) {
    return parseFloat(sale.totalAmount);
  }
  
  if (!sale.items) return 0;
  return sale.items.reduce((total, item) => {
    const quantity = parseFloat(item.quantity);
    const unitPrice = parseFloat(item.unitPrice); 
    if (isNaN(quantity) || isNaN(unitPrice)) {
      return total;
    }
    return total + (quantity * unitPrice);
  }, 0);
};


export const SalesTable = () => {
  const { data: sales = [], isLoading, isError, error } = useSales();

  return (
    <div className="rounded-lg border border-border overflow-hidden max-h-[500px] overflow-y-auto relative">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50 sticky top-0 z-10">
            <TableHead className="text-foreground font-semibold">Fecha</TableHead>
            <TableHead className="text-foreground font-semibold">Cliente</TableHead>
            <TableHead className="text-foreground font-semibold text-right">Total</TableHead>
            <TableHead className="text-foreground font-semibold text-center">Items</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          
          {isLoading && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                <Loader2 className="w-5 h-5 inline animate-spin mr-2" />
                Cargando ventas...
              </TableCell>
            </TableRow>
          )}

          {isError && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-red-500 py-8">
                Error al cargar: {error.message}
              </TableCell>
            </TableRow>
          )}

          {!isLoading && sales.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                <Info className="w-4 h-4 inline mr-2" />
                No hay ventas en los últimos 7 días.
              </TableCell>
            </TableRow>
          )}
          
          {sales.map((sale) => (
            <TableRow key={sale.id} className="hover:bg-muted/30">
              <TableCell className="text-muted-foreground">
                {formatARDate(sale.createdAt)}
              </TableCell>
              <TableCell className="font-medium text-foreground">
                {sale.customerRel?.name ?? (sale.customerId ? "..." : "Público General")}
              </TableCell>
              <TableCell className="text-right font-semibold text-accent">
                ${calculateTotal(sale).toFixed(2)}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
                  {sale.items?.length ?? 0}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
          
        </TableBody>
      </Table>
    </div>
  );
};