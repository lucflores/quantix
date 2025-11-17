import { useEffect, useState } from "react";
import { api } from "@/core/api/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Power } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface ProductTableProps {
  searchTerm: string;
  refreshKey: number;
  onEdit: (product: Product) => void;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  cost: number;
  price: number;
  stock: number;
  minStock: number;
  active: boolean;
}

export const ProductTable = ({
  searchTerm,
  refreshKey,
  onEdit,
}: ProductTableProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products", {
        params: { q: searchTerm, limit: 200, includeInactive: 1 },
      });
      setProducts(res.data.items || []);
    } catch {
      toast.error("Error cargando productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [refreshKey]);

  useEffect(() => {
    const timeout = setTimeout(loadProducts, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // --- Activar / desactivar ---
  const toggleStatus = async (product: Product) => {
    try {
      const newState = !product.active;

      await api.patch(`/products/${product.id}/status`, { active: newState });

      toast.success(newState ? "Producto activado" : "Producto desactivado");
      loadProducts();
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        (err?.response?.status === 409
          ? "No se puede desactivar un producto con stock > 0"
          : "No se pudo cambiar el estado");

      toast.error(msg);
    }
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead>SKU</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead className="text-right">Costo</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            <TableHead className="text-center">Stock</TableHead>
            <TableHead className="text-center">Stock Mín.</TableHead>
            <TableHead className="text-center">Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                Cargando...
              </TableCell>
            </TableRow>
          ) : products.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-8 text-muted-foreground"
              >
                No se encontraron productos
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id} className="hover:bg-muted/30">
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.name}</TableCell>

                <TableCell className="text-right">
                  ${product.cost.toFixed(2)}
                </TableCell>

                <TableCell className="text-right font-semibold">
                  ${product.price.toFixed(2)}
                </TableCell>

                <TableCell className="text-center">
                  <Badge
                    variant={
                      product.stock <= product.minStock
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {product.stock}
                  </Badge>
                </TableCell>

                <TableCell className="text-center">
                  {product.minStock}
                </TableCell>

                <TableCell className="text-center">
                  <Badge
                    variant={product.active ? "default" : "outline"}
                    className={
                      product.active
                        ? "bg-accent/20 text-accent border-accent/30"
                        : "bg-error/10 text-error border-error/30"
                    }
                  >
                    {product.active ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {/* EDITAR → abre modal en ProductsPage */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-accent"
                      onClick={() => onEdit(product)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>

                    {/* ACTIVAR / DESACTIVAR */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-accent"
                      onClick={() => toggleStatus(product)}
                    >
                      <Power className="w-4 h-4" />
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
