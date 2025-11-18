import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSupplierActivity } from "./hooks/useSuppliers"; 
import type { Supplier } from "./types";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  supplierId?: string;
  supplierName?: string;
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

export function SupplierDetails({ open, onOpenChange, supplierId, supplierName }: Props) {
  const { data, isLoading } = useSupplierActivity(supplierId);
  const activities = data?.items ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Actividad de {supplierName ?? "Proveedor"}
          </DialogTitle>
        </DialogHeader>

        <div className="rounded-lg border border-border overflow-hidden mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>ID Compra</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Monto Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    Cargando…
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && activities.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No se encontraron compras para este proveedor.
                  </TableCell>
                </TableRow>
              )}

              {activities.map((it) => {
                const amt = Number(it.totalAmount ?? 0);
                
                return (
                  <TableRow key={it.id} className="hover:bg-muted/30">
                    <TableCell className="text-muted-foreground">
                      {formatARDateTime(it.createdAt)}
                    </TableCell>
                    <TableCell className="text-foreground font-mono text-xs">
                      {it.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell className="text-foreground text-center">
                      {it.items?.length ?? 0}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-foreground font-medium">
                        ${amt.toFixed(2)}
                      </span>
                    </TableCell>
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