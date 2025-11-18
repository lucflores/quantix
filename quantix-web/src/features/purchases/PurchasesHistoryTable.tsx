import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import type { Purchase, PurchasesResponse } from "./types";


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

const HistoryRow = memo(function HistoryRow({
  c, onView,
}: {
  c: Purchase;
  onView: (p: Purchase) => void;
}) {
  const providerName = c.supplierRel?.name || (c.supplierId ? "Proveedor asociado" : "N/A");
  
  return (
    <TableRow className="hover:bg-muted/30">
      <TableCell className="text-muted-foreground">{formatARDate(c.createdAt)}</TableCell>
      <TableCell className="font-medium text-foreground">
        {providerName}
      </TableCell>
      <TableCell className="text-right font-semibold text-accent">
        ${calculateTotal(c).toFixed(2)}
      </TableCell>

      <TableCell className="text-center">
        <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
          {c.items?.length ?? 0}
        </Badge>
      </TableCell>

      <TableCell className="text-right">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="text-accent hover:text-accent hover:bg-accent/10" onClick={() => onView(c)}>
                <Eye className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ver detalles de la compra</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
    </TableRow>
  );
});

type Props = {
  data: PurchasesResponse | undefined; 
  isLoading: boolean;
  search: string;
  onView: (p: Purchase) => void;
};

export const PurchasesHistoryTable = ({ data, isLoading, search, onView }: Props) => {
  const purchases = data?.data ?? []; 
  
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="text-foreground font-semibold">Fecha</TableHead>
            <TableHead className="text-foreground font-semibold">Proveedor</TableHead>
            <TableHead className="text-foreground font-semibold text-right">Total</TableHead>
            <TableHead className="text-foreground font-semibold text-center">Items</TableHead>
            <TableHead className="text-foreground font-semibold text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                <Loader2 className="w-5 h-5 inline animate-spin mr-2" />
                Cargando historial...
              </TableCell>
            </TableRow>
          )}
          
          {!isLoading && data?.totalResults === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                {search ? "No se encontraron compras" : "Sin historial de compras"}
              </TableCell>
            </TableRow>
          )}
          {purchases.map((c) => (
            <HistoryRow 
              key={c.id} 
              c={c as Purchase} 
              onView={onView} 
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};