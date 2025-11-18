import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { CustomerTable } from "./CustomerTable";
import { CustomerDetails } from "./CustomerDetails";
import CustomerForm from "./CustomerForm";
import type { Customer } from "./types";
import { 
  useDisableCustomer, 
  useEnableCustomer,
  useCustomers
} from "./hooks/useCustomers";


export const CustomersPage = () => {
  const { mutateAsync: disableCustomer } = useDisableCustomer();
  const { mutateAsync: enableCustomer } = useEnableCustomer();
  const [page, setPage] = useState(1);
  const [limit] = useState(20); 
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [viewing, setViewing] = useState<Customer | null>(null);
  const { 
    data: customersResponse, 
    isLoading 
  } = useCustomers(page, limit, search); 
  const totalPages = customersResponse?.totalPages ?? 1;
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

  const onToggleActive = async (id: string, active: boolean) => {
    try {
      if (active) await disableCustomer(id);
      else await enableCustomer(id);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        "No se pudo cambiar el estado";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">
            Gestión de clientes para ventas en cuenta corriente
          </p>
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="btn-gradient">
          <Plus className="w-4 h-4 mr-2" /> Nuevo Cliente
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
              placeholder="Buscar por nombre, email o teléfono"
              className="pl-10 bg-input border-border"
            />
          </div>
        </div>
        <CustomerTable
          data={customersResponse}
          isLoading={isLoading}
          search={search}
          onView={(c) => setViewing(c)}
          onEdit={(c) => { setEditing(c); setOpen(true); }}
          onToggleActive={onToggleActive}
        />
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages} (Total: {customersResponse?.totalResults ?? 0} clientes)
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editing ? "Editar Cliente" : "Nuevo Cliente"}
            </DialogTitle>
          </DialogHeader>
          <CustomerForm
            defaultValues={
              editing
                ? {
                    id: editing.id,
                    name: editing.name,
                    email: editing.email ?? "",
                    phone: editing.phone ?? "",
                  }
                : undefined
            }
            onClose={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <CustomerDetails
        open={!!viewing}
        onOpenChange={(v) => !v && setViewing(null)}
        customerId={viewing?.id}
        customerName={viewing?.name}
      />
    </div>
  );
};