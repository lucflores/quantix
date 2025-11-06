import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Power } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ProductTableProps {
  searchTerm: string;
}

// Mock data
const mockProducts = [
  { id: '1', sku: 'PROD-001', name: 'Laptop Dell XPS 13', cost: 850, price: 1200, stock: 15, minStock: 5, active: true },
  { id: '2', sku: 'PROD-002', name: 'Mouse Logitech MX Master', cost: 45, price: 85, stock: 3, minStock: 10, active: true },
  { id: '3', sku: 'PROD-003', name: 'Teclado Mecánico RGB', cost: 65, price: 120, stock: 25, minStock: 8, active: true },
  { id: '4', sku: 'PROD-004', name: 'Monitor LG 27" 4K', cost: 320, price: 550, stock: 8, minStock: 5, active: false },
  { id: '5', sku: 'PROD-005', name: 'Webcam Logitech C920', cost: 55, price: 95, stock: 12, minStock: 6, active: true },
];

export const ProductTable = ({ searchTerm }: ProductTableProps) => {
  const [products] = useState(mockProducts);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="text-foreground font-semibold">SKU</TableHead>
            <TableHead className="text-foreground font-semibold">Nombre</TableHead>
            <TableHead className="text-foreground font-semibold text-right">Costo</TableHead>
            <TableHead className="text-foreground font-semibold text-right">Precio</TableHead>
            <TableHead className="text-foreground font-semibold text-center">Stock</TableHead>
            <TableHead className="text-foreground font-semibold text-center">Stock Mín.</TableHead>
            <TableHead className="text-foreground font-semibold text-center">Estado</TableHead>
            <TableHead className="text-foreground font-semibold text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                No se encontraron productos
              </TableCell>
            </TableRow>
          ) : (
            filteredProducts.map((product) => (
              <TableRow key={product.id} className="hover:bg-muted/30">
                <TableCell className="font-mono text-sm text-accent">{product.sku}</TableCell>
                <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                <TableCell className="text-right text-muted-foreground">${product.cost}</TableCell>
                <TableCell className="text-right text-foreground font-semibold">${product.price}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={product.stock <= product.minStock ? 'destructive' : 'secondary'}>
                    {product.stock}
                  </Badge>
                </TableCell>
                <TableCell className="text-center text-muted-foreground">{product.minStock}</TableCell>
                <TableCell className="text-center">
                  <Badge 
                    variant={product.active ? 'default' : 'outline'} 
                    className={product.active 
                      ? 'bg-accent/20 text-accent border-accent/30 hover:bg-accent/30' 
                      : 'bg-error/10 text-error border-error/30 hover:bg-error/20'
                    }
                  >
                    {product.active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" className="text-accent hover:text-accent hover:bg-accent/10">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-accent hover:text-accent hover:bg-accent/10">
                      <Power className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-muted-foreground hover:bg-muted/50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
