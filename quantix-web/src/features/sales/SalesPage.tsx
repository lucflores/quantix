// src/features/sales/SalesPage.tsx
import { Card } from '@/components/ui/card';
import { SaleForm } from './SaleForm';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRecentSales } from './hooks/useSales';

export const SalesPage = () => {
  const { data: recentSales, isLoading } = useRecentSales(10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Ventas</h1>
        <p className="text-muted-foreground">Registro de ventas y salida de stock</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 glass-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Nueva Venta</h2>
          <SaleForm />
        </Card>

        <Card className="p-6 glass-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Últimas Ventas</h2>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-foreground font-semibold">Fecha</TableHead>
                  <TableHead className="text-foreground font-semibold">Cliente</TableHead>
                  <TableHead className="text-foreground font-semibold text-right">Total</TableHead>
                  <TableHead className="text-foreground font-semibold text-center">Método</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      Cargando...
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && (recentSales?.length ?? 0) === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      Sin ventas aún
                    </TableCell>
                  </TableRow>
                )}

                {recentSales?.map((sale) => (
                  <TableRow key={sale.id} className="hover:bg-muted/30">
                    <TableCell className="text-muted-foreground text-sm">
                      {(() => {
                        const d = new Date(sale.date);
                        return isNaN(d.getTime()) ? String(sale.date) : d.toLocaleString();
                      })()}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {sale.customerName ?? "Público General"}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-accent">
                      ${sale.total}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
                        {sale.payment}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};
