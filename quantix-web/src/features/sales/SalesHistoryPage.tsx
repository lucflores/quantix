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
import { SalesHistoryTable } from './SalesHistoryTable';
import type { Sale } from './types';
import { useSalesHistory } from './hooks/useSales';


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
const calculateTotal = (sale: Sale): number => {
  if (!sale) return 0;
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

export const SalesHistoryPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState<Sale | null>(null);
  const { 
    data: salesResponse, 
    isLoading 
  } = useSalesHistory(page, limit, search);

  const totalPages = salesResponse?.totalPages ?? 1;

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
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Historial de Ventas</h1>
          <p className="text-muted-foreground">
            Busca y filtra todas las ventas registradas.
          </p>
        </div>
        
        <Button 
          variant="default" 
          size="icon" 
          className="btn-gradient" 
          onClick={() => navigate('/sales')}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </div>

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
              placeholder="Buscar por Cliente, nombre de producto o SKU..."
              className="pl-10 bg-input border-border"
            />
          </div>
        </div>

        <SalesHistoryTable
          data={salesResponse}
          isLoading={isLoading}
          search={search}
          onView={(sale) => setViewing(sale)}
        />

        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages} (Total: {salesResponse?.totalResults ?? 0} ventas)
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

      <Dialog open={!!viewing} onOpenChange={(v) => !v && setViewing(null)}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Detalle de Venta
            </DialogTitle>
            <DialogDescription>
              ID: {viewing?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm space-y-4">
            <div>
              <p><strong>Fecha:</strong> {formatARDateTime(viewing?.createdAt)}</p>
              <p><strong>Cliente:</strong> {viewing?.customerRel?.name || "Público General"}</p>
              <p><strong>Método de Pago:</strong> {viewing?.payment}</p>
            </div>
            
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-center">Cant.</TableHead>
                    <TableHead className="text-right">Precio Unit.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {viewing?.items?.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">{item.product?.name || "N/A"}</div>
                        <div className="text-xs text-muted-foreground">{item.product?.sku || ""}</div>
                      </TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">${parseFloat(item.unitPrice).toFixed(2)}</TableCell>
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