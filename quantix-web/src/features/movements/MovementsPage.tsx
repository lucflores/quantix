import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { MovementsTable } from './MovementsTable';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const MovementsPage = () => {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: 'all',
  });

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
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="bg-input border-border"
            />
          </div>

          <div className="space-y-2">
            <Label>Fecha Hasta</Label>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="bg-input border-border"
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo de Movimiento</Label>
            <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="IN">Entrada (IN)</SelectItem>
                <SelectItem value="OUT">Salida (OUT)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <MovementsTable filters={filters} />
      </Card>
    </div>
  );
};
