import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const mockCustomers = [
  { id: '1', name: 'Carlos Mendoza', email: 'carlos@email.com', phone: '555-0101', balance: -1200, active: true },
  { id: '2', name: 'Ana López', email: 'ana@email.com', phone: '555-0102', balance: 0, active: true },
  { id: '3', name: 'Restaurante El Buen Sabor', email: 'contacto@buensabor.com', phone: '555-0103', balance: -3450, active: true },
  { id: '4', name: 'María González', email: 'maria@email.com', phone: '555-0104', balance: 0, active: false },
];

export const CustomerTable = () => {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="text-foreground font-semibold">Nombre</TableHead>
            <TableHead className="text-foreground font-semibold">Email</TableHead>
            <TableHead className="text-foreground font-semibold">Teléfono</TableHead>
            <TableHead className="text-foreground font-semibold text-right">Saldo</TableHead>
            <TableHead className="text-foreground font-semibold text-center">Estado</TableHead>
            <TableHead className="text-foreground font-semibold text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockCustomers.map((customer) => (
            <TableRow key={customer.id} className="hover:bg-muted/30">
              <TableCell className="font-medium text-foreground">{customer.name}</TableCell>
              <TableCell className="text-muted-foreground">{customer.email}</TableCell>
              <TableCell className="text-muted-foreground">{customer.phone}</TableCell>
              <TableCell className="text-right">
                <span className={customer.balance < 0 ? 'text-error font-semibold' : 'text-accent font-semibold'}>
                  {customer.balance < 0 && '-'}${Math.abs(customer.balance)}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={customer.active ? 'default' : 'outline'} className="bg-accent/20 text-accent border-accent/30">
                  {customer.active ? 'Activo' : 'Inactivo'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" className="text-accent hover:text-accent hover:bg-accent/10">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-accent hover:text-accent hover:bg-accent/10">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
