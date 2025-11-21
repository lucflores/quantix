import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { MovementsTable } from "./MovementsTable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMovements } from "./hooks/useMovements";

export const MovementsPage = () => {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: "all",
  });

  const [page, setPage] = useState(1);
  const limit = 20;

  const { data: movements = [], isLoading } = useMovements();

  // 🔥 FILTRADO LOCAL
  const filtered = useMemo(() => {
    return movements.filter((m: any) => {
      const date = new Date(m.createdAt).getTime();
      const start = filters.startDate ? new Date(filters.startDate).getTime() : 0;
      const end = filters.endDate ? new Date(filters.endDate).getTime() : Infinity;

      if (date < start || date > end) return false;
      if (filters.type !== "all" && m.kind !== filters.type) return false;

      return true;
    });
  }, [movements, filters]);

  // 🔥 PAGINADO LOCAL
  const totalResults = filtered.length;
  const totalPages = Math.ceil(totalResults / limit) || 1;

  const paginated = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page, limit]);

  const nextPage = () => page < totalPages && setPage(page + 1);
  const prevPage = () => page > 1 && setPage(page - 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Movimientos de Stock</h1>
        <p className="text-muted-foreground">Historial completo de entradas y salidas</p>
      </div>

      <Card className="p-6 glass-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <Label>Fecha Desde</Label>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => {
                setPage(1);
                setFilters({ ...filters, startDate: e.target.value });
              }}
              className="bg-input border-border"
            />
          </div>

          <div className="space-y-2">
            <Label>Fecha Hasta</Label>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => {
                setPage(1);
                setFilters({ ...filters, endDate: e.target.value });
              }}
              className="bg-input border-border"
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo de Movimiento</Label>
            <Select
              value={filters.type}
              onValueChange={(value) => {
                setPage(1);
                setFilters({ ...filters, type: value });
              }}
            >
              <SelectTrigger className="bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="IN">Entrada</SelectItem>
                <SelectItem value="OUT">Salida</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <MovementsTable data={paginated} isLoading={isLoading} filters={filters} />

        {/* PAGINADO */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages} (Total: {totalResults} movimientos)
          </span>

          <div className="flex gap-2">
            <button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-3 py-1 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none"
              onClick={prevPage}
              disabled={page === 1}
            >
              Anterior
            </button>

            <button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-3 py-1 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none"
              onClick={nextPage}
              disabled={page >= totalPages}
            >
              Siguiente
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
