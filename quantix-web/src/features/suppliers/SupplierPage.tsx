import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { SupplierTable } from "./SupplierTable";
import SupplierForm from "./SupplierForm";
import { SupplierDetails } from "./SupplierDetails";
import type { Supplier } from "./types";
import { 
  useDisableSupplier, 
  useEnableSupplier,
} from "./hooks/useSuppliers";

export const SupplierPage = () => {
  const { mutateAsync: disableSupplier } = useDisableSupplier();
  const { mutateAsync: enableSupplier } = useEnableSupplier();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState<Supplier | null>(null);
  const onToggleActive = async (id: string, active: boolean) => {
    try {
      if (active) await disableSupplier(id);
      else await enableSupplier(id);
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
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Proveedores</h1>
          <p className="text-muted-foreground">
            Gestión de proveedores para órdenes de compra
          </p>
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="btn-gradient">
          <Plus className="w-4 h-4 mr-2" /> Nuevo Proveedor
        </Button>
      </div>

      <Card className="p-6 glass-card">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, email, teléfono o CUIT"
              className="pl-10 bg-input border-border"
            />
          </div>
        </div>
        
        <SupplierTable
          search={search} 
          onView={(s) => setViewing(s)}
          onEdit={(s) => { setEditing(s); setOpen(true); }}
          onToggleActive={onToggleActive}
        />
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editing ? "Editar Proveedor" : "Nuevo Proveedor"}
            </DialogTitle>
          </DialogHeader>
          <SupplierForm
            defaultValues={editing ? editing : undefined}
            onClose={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <SupplierDetails
        open={!!viewing}
        onOpenChange={(v) => !v && setViewing(null)}
        supplierId={viewing?.id}
        supplierName={viewing?.name}
      />
    </div>
  );
};