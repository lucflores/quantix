// quantix-web/src/features/purchases/PurchasesHistoryPage.tsx
// (Versión con botón de Volver "lindo")

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ArrowLeft, Search } from 'lucide-react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

import { PurchasesHistoryTable } from './PurchasesHistoryTable';
import type { Purchase } from './types';
import { usePurchaseHistory } from './hooks/usePurchases';

// (Helper de formato de fecha)
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
// (Helper de Total)
const calculateTotal = (purchase: Purchase): number => {
  if (!purchase) return 0;
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

export const PurchasesHistoryPage = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState<Purchase | null>(null);

  const { 
    data: purchasesResponse, 
    isLoading 
  } = usePurchaseHistory(page, limit, search);

  const totalPages = purchasesResponse?.totalPages ?? 1;

  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };
  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };


  return (
    <div className="space-y-6">
      
      {/* 1. Encabezado (Layout Corregido) */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Historial de Compras</h1>
          <p className="text-muted-foreground">
            Busca y filtra todas las compras registradas.
          </p>
        </div>
        
        {/* --- CAMBIO AQUÍ --- */}
        {/* Usamos 'btn-gradient' (tu estilo principal) en lugar de 'outline' */}
        <Button 
          variant="default" // <-- CAMBIO (quitamos 'outline')
          size="icon" 
          className="btn-gradient" // <-- CAMBIO (añadimos tu clase de gradiente)
          onClick={() => navigate('/purchases')}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </div>

      {/* 2. Tarjeta con Buscador y Tabla */}
      <Card className="p-6 glass-card">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); 
              }}
              placeholder="Buscar por Proveedor, nombre de producto o SKU..."
              className="pl-10 bg-input border-border"
            />
          </div>
        </div>

        <PurchasesHistoryTable
          data={purchasesResponse}
          isLoading={isLoading}
          search={search}
          onView={(purchase) => setViewing(purchase)}
        />

        {/* 3. Controles de Paginación */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages} (Total: {purchasesResponse?.totalResults ?? 0} compras)
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
      </Card>

      {/* 4. Modal (Dialog) para "Ver Detalles" (Sin cambios) */}
      <Dialog open={!!viewing} onOpenChange={(v) => !v && setViewing(null)}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Detalle de Compra
            </DialogTitle>
            <DialogDescription>
              ID: {viewing?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm space-y-4">
            <div>
              <p><strong>Fecha:</strong> {formatARDateTime(viewing?.createdAt)}</p>
              <p><strong>Proveedor:</strong> {viewing?.supplierRel?.name || "N/A"}</p>
            </div>
            
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-center">Cant.</TableHead>
                    <TableHead className="text-right">Costo Unit.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {viewing?.items.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">{item.product?.name || "N/A"}</div>
                        <div className="text-xs text-muted-foreground">{item.product?.sku || ""}</div>
                      </TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">${parseFloat(item.unitCost).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="text-right text-lg">
              <strong>Total:</strong>
              <span className="font-bold text-accent ml-2">
                ${calculateTotal(viewing!)}
              </span>
            </div>
          </div>
          <Button onClick={() => setViewing(null)} variant="outline">Cerrar</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};