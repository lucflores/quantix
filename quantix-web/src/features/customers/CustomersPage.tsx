import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCustomers, useDeleteCustomer } from "./hooks/useCustomers";
import CustomerForm from "./CustomerForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export const CustomersPage = () => {
  const { data: customers, isLoading } = useCustomers();
  const { mutateAsync: remove, isPending: deleting } = useDeleteCustomer();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [search, setSearch] = useState("");

  const list = useMemo(() => {
    const arr = Array.isArray(customers) ? customers : [];
    if (!search) return arr;
    const q = search.toLowerCase();
    return arr.filter(c =>
      (c.name ?? "").toLowerCase().includes(q) ||
      (c.email ?? "").toLowerCase().includes(q) ||
      (c.phone ?? "").toLowerCase().includes(q)
    );
  }, [customers, search]);

  const onDelete = async (id: string) => {
    try { await remove(id); toast.success("Cliente eliminado"); }
    catch (e: any) { toast.error(e?.response?.data?.message || "No se pudo eliminar"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Gestión de clientes para ventas en cuenta corriente</p>
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="btn-gradient">
          <Plus className="w-4 h-4 mr-2" /> Nuevo Cliente
        </Button>
      </div>

      <Card className="p-6 glass-card">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre, email o teléfono" className="pl-10 bg-input border-border"/>
          </div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="text-foreground font-semibold">Nombre</TableHead>
                <TableHead className="text-foreground font-semibold">Email</TableHead>
                <TableHead className="text-foreground font-semibold">Teléfono</TableHead>
                <TableHead className="text-right text-foreground font-semibold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow><TableCell colSpan={4} className="py-6 text-center text-muted-foreground">Cargando...</TableCell></TableRow>
              )}
              {!isLoading && list.length === 0 && (
                <TableRow><TableCell colSpan={4} className="py-6 text-center text-muted-foreground">Sin clientes</TableCell></TableRow>
              )}
              {list.map(c => (
                <TableRow key={c.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium text-foreground">{c.name}</TableCell>
                  <TableCell className="text-muted-foreground">{c.email ?? <Badge variant="outline">—</Badge>}</TableCell>
                  <TableCell className="text-muted-foreground">{c.phone ?? <Badge variant="outline">—</Badge>}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" className="text-accent hover:bg-accent/10"
                        onClick={() => { setEditing(c); setOpen(true); }}>
                        <Edit2 className="w-4 h-4"/>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-muted/50"
                        disabled={deleting} onClick={() => onDelete(c.id)}>
                        <Trash2 className="w-4 h-4"/>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader><DialogTitle className="text-foreground">{editing ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle></DialogHeader>
          <CustomerForm
            defaultValues={editing ? { id: editing.id, name: editing.name, email: editing.email ?? "", phone: editing.phone ?? "" } : undefined}
            onClose={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
