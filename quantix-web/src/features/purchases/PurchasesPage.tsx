import { Card } from '@/components/ui/card';
import { PurchaseForm } from './PurchaseForm';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const recentPurchases = [
  { id: '1', date: '2025-01-15', supplier: 'Tech Distributor SA', total: 8500, items: 3 },
  { id: '2', date: '2025-01-14', supplier: 'Global Electronics', total: 5200, items: 2 },
  { id: '3', date: '2025-01-13', supplier: 'Tech Distributor SA', total: 12300, items: 5 },
];

export const PurchasesPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Compras</h1>
        <p className="text-muted-foreground">Registro de compras y actualización de stock</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 glass-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Nueva Compra</h2>
          <PurchaseForm />
        </Card>

        <Card className="p-6 glass-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Últimas Compras</h2>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-foreground font-semibold">Fecha</TableHead>
                  <TableHead className="text-foreground font-semibold">Proveedor</TableHead>
                  <TableHead className="text-foreground font-semibold text-right">Total</TableHead>
                  <TableHead className="text-foreground font-semibold text-center">Items</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPurchases.map((purchase) => (
                  <TableRow key={purchase.id} className="hover:bg-muted/30">
                    <TableCell className="text-muted-foreground">{purchase.date}</TableCell>
                    <TableCell className="font-medium text-foreground">{purchase.supplier}</TableCell>
                    <TableCell className="text-right font-semibold text-accent">${purchase.total}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
                        {purchase.items}
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
