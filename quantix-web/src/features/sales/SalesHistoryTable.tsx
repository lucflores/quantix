import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import type { Sale, SalesResponse } from "./types"; 


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

const HistoryRow = memo(function HistoryRow({
  c, onView,
}: {
  c: Sale;
  onView: (s: Sale) => void;
}) {
  return (
    <TableRow className="hover:bg-muted/30">
      <TableCell className="text-muted-foreground">{formatARDate(c.createdAt)}</TableCell>
      <TableCell className="font-medium text-foreground">
        {c.customerRel?.name ?? (c.customerId ? "..." : "Público General")}
      </TableCell>
      <TableCell className="text-right font-semibold text-accent">
        ${calculateTotal(c).toFixed(2)}
      </TableCell>
      <TableCell className="text-center">
        <Badge variant={c.payment === 'CTA_CTE' ? "outline" : "secondary"}
               className={c.payment === 'CTA_CTE' 
                          ? "border-orange-500/50 text-orange-400" 
                          : "bg-accent/20 text-accent border-accent/30"}
        >
          {c.payment}
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
            <TooltipContent>Ver detalles de la venta</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
    </TableRow>
  );
});

type Props = {
  data: SalesResponse | undefined; 
  isLoading: boolean;
  search: string;
  onView: (s: Sale) => void;
};

export const SalesHistoryTable = ({ data, isLoading, search, onView }: Props) => {
  
  const sales = data?.data ?? []; 
  
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="text-foreground font-semibold">Fecha</TableHead>
            <TableHead className="text-foreground font-semibold">Cliente</TableHead>
            <TableHead className="text-foreground font-semibold text-right">Total</TableHead>
            <TableHead className="text-foreground font-semibold text-center">Pago</TableHead>
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
                {search ? "No se encontraron ventas" : "Sin historial de ventas"}
              </TableCell>
            </TableRow>
          )}

          {sales.map((c) => (
            <HistoryRow 
              key={c.id} 
              c={c as Sale} 
              onView={onView} 
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};