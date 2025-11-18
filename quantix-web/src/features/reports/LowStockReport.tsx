// quantix-web/src/features/reports/LowStockReport.tsx

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, Info } from "lucide-react";

// Imports de nuestra lógica
import { useLowStockReport } from "./hooks/useReports";

export const LowStockReport = () => {
  // Estado de paginación
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  // Hook de datos
  const { data, isLoading, isError } = useLowStockReport(page, limit);

  const items = data?.items ?? [];
  const totalCount = data?.total ?? 0;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  // Paginación
  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };
  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Stock</h1>
        <p className="text-muted-foreground">
          Productos que requieren reabastecimiento
        </p>
      </div>

      {/* Alerta / Resumen */}
      <Card className="p-4 border-l-4 border-l-red-500 bg-red-500/10 flex items-center gap-4">
        <div className="p-2 bg-red-500/20 rounded-full">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-red-500">
            {isLoading ? "Calculando..." : `${totalCount} productos por debajo del stock mínimo`}
          </h3>
          <p className="text-sm text-red-400/80">
            Ordenados por cantidad faltante (prioridad de compra)
          </p>
        </div>
      </Card>

      {/* Tabla de Reporte */}
      <Card className="p-6 glass-card">
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="text-foreground font-semibold">SKU</TableHead>
                <TableHead className="text-foreground font-semibold">Producto</TableHead>
                <TableHead className="text-center text-foreground font-semibold">Stock Actual</TableHead>
                <TableHead className="text-center text-foreground font-semibold">Stock Mínimo</TableHead>
                <TableHead className="text-right text-foreground font-semibold">Faltante</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    <Loader2 className="w-5 h-5 inline animate-spin mr-2" />
                    Analizando inventario...
                  </TableCell>
                </TableRow>
              )}

              {isError && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-red-500">
                    Error al cargar el reporte de stock.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Info className="w-8 h-8 text-green-500" />
                      <p className="font-medium text-foreground">¡Todo en orden!</p>
                      <p>No hay productos con stock bajo.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {items.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {item.sku}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {item.name}
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
                      {item.stock}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="text-center text-muted-foreground">
                    {item.minStock}
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <span className="font-bold text-red-500">
                      -{item.shortage}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Paginación */}
        {totalCount > 0 && (
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">
              Página {page} de {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevPage}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={page >= totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};