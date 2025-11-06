import { Badge } from '@/components/ui/badge';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface MovementsTableProps {
  filters: {
    startDate: string;
    endDate: string;
    type: string;
  };
}

const mockMovements = [
  { id: '1', date: '2025-01-15 14:30', type: 'IN', product: 'Laptop Dell XPS 13', quantity: 10, user: 'Juan Pérez' },
  { id: '2', date: '2025-01-15 15:45', type: 'OUT', product: 'Mouse Logitech MX Master', quantity: 2, user: 'María González' },
  { id: '3', date: '2025-01-14 10:20', type: 'IN', product: 'Teclado Mecánico RGB', quantity: 15, user: 'Carlos Ruiz' },
  { id: '4', date: '2025-01-14 16:30', type: 'OUT', product: 'Monitor LG 27" 4K', quantity: 1, user: 'Ana Silva' },
  { id: '5', date: '2025-01-13 09:15', type: 'IN', product: 'Webcam Logitech C920', quantity: 20, user: 'Juan Pérez' },
];

export const MovementsTable = ({ filters }: MovementsTableProps) => {
  const filteredMovements = mockMovements.filter((movement) => {
    if (filters.type !== 'all' && movement.type !== filters.type) return false;
    return true;
  });

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="text-foreground font-semibold">Fecha y Hora</TableHead>
            <TableHead className="text-foreground font-semibold">Tipo</TableHead>
            <TableHead className="text-foreground font-semibold">Producto</TableHead>
            <TableHead className="text-foreground font-semibold text-center">Cantidad</TableHead>
            <TableHead className="text-foreground font-semibold">Usuario</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMovements.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No hay movimientos para mostrar
              </TableCell>
            </TableRow>
          ) : (
            filteredMovements.map((movement) => (
              <TableRow key={movement.id} className="hover:bg-muted/30">
                <TableCell className="text-muted-foreground">{movement.date}</TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary" 
                    className={movement.type === 'IN' 
                      ? 'bg-accent/20 text-accent border-accent/30 hover:bg-accent/30' 
                      : 'bg-error/10 text-error border-error/30 hover:bg-error/20'
                    }
                  >
                    {movement.type === 'IN' ? (
                      <><ArrowDownCircle className="w-3 h-3 mr-1" /> Entrada</>
                    ) : (
                      <><ArrowUpCircle className="w-3 h-3 mr-1" /> Salida</>
                    )}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-foreground">{movement.product}</TableCell>
                <TableCell className="text-center font-semibold text-foreground">{movement.quantity}</TableCell>
                <TableCell className="text-muted-foreground">{movement.user}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
