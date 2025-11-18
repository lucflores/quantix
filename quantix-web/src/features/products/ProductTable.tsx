import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Power, Loader2, Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Product, ProductsResponse } from "./types";

interface ProductTableProps {
  data: ProductsResponse | undefined;
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onToggleStatus: (id: string, currentActive: boolean) => void;
}

export const ProductTable = ({
  data,
  isLoading,
  onEdit,
  onToggleStatus,
}: ProductTableProps) => {
  
  const products = data?.data ?? [];

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[100px]">SKU</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead className="text-right">Costo</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            <TableHead className="text-center">Stock</TableHead>
            <TableHead className="text-center">Mínimo</TableHead>
            <TableHead className="text-center">Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                <Loader2 className="w-5 h-5 inline animate-spin mr-2" />
                Cargando productos...
              </TableCell>
            </TableRow>
          )}

          {!isLoading && products.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                <Info className="w-4 h-4 inline mr-2" />
                No se encontraron productos.
              </TableCell>
            </TableRow>
          )}

          {products.map((product) => {
            const stockNum = parseFloat(product.stock);
            const minStockNum = parseFloat(product.minStock);
            const isLowStock = stockNum <= minStockNum;

            return (
              <TableRow key={product.id} className="hover:bg-muted/30">
                <TableCell className="font-mono text-xs text-muted-foreground">{product.sku}</TableCell>
                <TableCell className="font-medium text-foreground">{product.name}</TableCell>

                <TableCell className="text-right text-muted-foreground">
                  ${product.cost}
                </TableCell>

                <TableCell className="text-right font-semibold text-accent">
                  ${product.price}
                </TableCell>

                <TableCell className="text-center">
                  <Badge
                    variant={isLowStock ? "destructive" : "secondary"}
                    className={isLowStock ? "" : "bg-accent/20 text-accent border-accent/30"}
                  >
                    {product.stock}
                  </Badge>
                </TableCell>

                <TableCell className="text-center text-muted-foreground text-sm">
                  {product.minStock}
                </TableCell>

                <TableCell className="text-center">
                  <Badge
                    variant={product.active ? "outline" : "destructive"}
                    className={
                       product.active 
                       ? "text-foreground border-border" 
                       : "bg-destructive/10 text-destructive border-destructive/20"
                    }
                  >
                    {product.active ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <TooltipProvider>
                       <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-accent hover:text-accent hover:bg-accent/10"
                            onClick={() => onEdit(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Editar</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-muted-foreground hover:bg-muted/50"
                            onClick={() => onToggleStatus(product.id, product.active)}
                          >
                            <Power className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{product.active ? "Desactivar" : "Activar"}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};