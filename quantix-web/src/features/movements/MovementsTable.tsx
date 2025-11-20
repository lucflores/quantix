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
import { useMovements } from '@/features/movements/hooks/useMovements';

interface MovementsTableProps {
  filters: {
    startDate: string;
    endDate: string;
    type: string; // "all", "IN", "OUT"
  };
}

export const MovementsTable = ({ filters }: MovementsTableProps) => {
  const { data: movements = [], isLoading } = useMovements();

  const filteredMovements = movements.filter((m: any) => {
    if (filters.type !== 'all' && m.kind !== filters.type) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Cargando movimientos...
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="text-foreground font-semibold">Fecha y Hora</TableHead>
            <TableHead className="text-foreground font-semibold">Tipo</TableHead>
            <TableHead className="text-foreground font-semibold">Producto</TableHead>
            <TableHead className="text-foreground font-semibold text-center">
              Cantidad
            </TableHead>

            {/* <TableHead className="text-foreground font-semibold">Usuario</TableHead> */}
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
            filteredMovements.map((m: any) => (
              <TableRow key={m.id} className="hover:bg-muted/30">
                <TableCell className="text-muted-foreground">
                  {new Date(m.createdAt).toLocaleString()}
                </TableCell>

                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      m.kind === 'IN'
                        ? 'bg-accent/20 text-accent border-accent/30 hover:bg-accent/30'
                        : 'bg-error/10 text-error border-error/30 hover:bg-error/20'
                    }
                  >
                    {m.kind === 'IN' ? (
                      <>
                        <ArrowDownCircle className="w-3 h-3 mr-1" /> Entrada
                      </>
                    ) : (
                      <>
                        <ArrowUpCircle className="w-3 h-3 mr-1" /> Salida
                      </>
                    )}
                  </Badge>
                </TableCell>

                <TableCell className="font-medium text-foreground">
                  {m.productName}
                </TableCell>

                <TableCell className="text-center font-semibold text-foreground">
                  {m.quantity}
                </TableCell>

                {/* <TableCell className="text-muted-foreground">{m.userName}</TableCell> */}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
