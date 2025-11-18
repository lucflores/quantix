import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge"; 
import { usePurchases } from "./hooks/usePurchases";
import type { Purchase } from "./types";


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
const calculateTotal = (purchase: Purchase): number => {
  if (purchase.totalAmount) {
    return parseFloat(purchase.totalAmount);
  }
  if (!purchase.items) return 0;

  return purchase.items.reduce((total, item) => {
    const quantity = parseFloat(item.quantity);
    const unitCost = parseFloat(item.unitCost);
    if (isNaN(quantity) || isNaN(unitCost)) {
      return total;
    }
    return total + (quantity * unitCost);
  }, 0);
};


export const PurchasesTable = () => {
  const { data: purchases = [], isLoading, isError, error } = usePurchases();

  return (
    <div className="rounded-lg border border-border overflow-hidden max-h-[500px] overflow-y-auto relative">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50 sticky top-0 z-10">
            <TableHead className="text-foreground font-semibold">Fecha</TableHead>
            <TableHead className="text-foreground font-semibold">Proveedor</TableHead>
            <TableHead className="text-foreground font-semibold text-right">Total</TableHead>
            <TableHead className="text-foreground font-semibold text-center">Items</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          
          {isLoading && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                <Loader2 className="w-5 h-5 inline animate-spin mr-2" />
                Cargando compras...
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

          {!isLoading && purchases.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                <Info className="w-4 h-4 inline mr-2" />
                No hay compras en los últimos 7 días.
              </TableCell>
            </TableRow>
          )}
          
          {purchases.map((purchase) => (
            <TableRow key={purchase.id} className="hover:bg-muted/30">
              <TableCell className="text-muted-foreground">
                {formatARDate(purchase.createdAt)}
              </TableCell>
              <TableCell className="font-medium text-foreground">
                {purchase.supplierRel?.name ?? (purchase.supplierId ? "..." : "N/A")}
              </TableCell>
              <TableCell className="text-right font-semibold text-accent">
                ${calculateTotal(purchase).toFixed(2)}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
                  {purchase.items?.length ?? 0}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
          
        </TableBody>
      </Table>
    </div>
  );
};