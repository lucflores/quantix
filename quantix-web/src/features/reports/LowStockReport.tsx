import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const lowStockProducts = [
  { id: '1', sku: 'PROD-002', name: 'Mouse Logitech MX Master', stock: 3, minStock: 10, missing: 7 },
  { id: '2', sku: 'PROD-008', name: 'Cable USB-C Premium', stock: 5, minStock: 20, missing: 15 },
  { id: '3', sku: 'PROD-015', name: 'Auriculares Bluetooth', stock: 2, minStock: 8, missing: 6 },
  { id: '4', sku: 'PROD-022', name: 'Hub USB 4 Puertos', stock: 4, minStock: 12, missing: 8 },
].sort((a, b) => b.missing - a.missing);

export const LowStockReport = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Stock</h1>
        <p className="text-muted-foreground">Productos que requieren reabastecimiento</p>
      </div>

      <Card className="p-6 glass-card">
        <div className="flex items-center gap-3 mb-6 p-4 rounded-lg bg-muted/30">
          <AlertCircle className="w-6 h-6 text-muted-foreground" />
          <div>
            <p className="font-semibold text-foreground">
              {lowStockProducts.length} productos por debajo del stock mínimo
            </p>
            <p className="text-sm text-muted-foreground">
              Ordenados por cantidad faltante
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="text-foreground font-semibold">SKU</TableHead>
                <TableHead className="text-foreground font-semibold">Producto</TableHead>
                <TableHead className="text-foreground font-semibold text-center">Stock Actual</TableHead>
                <TableHead className="text-foreground font-semibold text-center">Stock Mínimo</TableHead>
                <TableHead className="text-foreground font-semibold text-center">Faltante</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowStockProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-sm text-accent">{product.sku}</TableCell>
                  <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="destructive" className="bg-muted/50 text-muted-foreground border-muted">
                      {product.stock}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">{product.minStock}</TableCell>
                  <TableCell className="text-center font-semibold text-error">
                    -{product.missing}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};
