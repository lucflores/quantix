import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCreateSupplier, useUpdateSupplier } from "./hooks/useSuppliers";
import type { Supplier } from "./types";

type Props = {
  onClose: () => void;
  defaultValues?: Supplier; 
};

export default function SupplierForm({ onClose, defaultValues }: Props) {
  const isEdit = !!defaultValues?.id;
  const [name, setName] = useState(defaultValues?.name ?? "");
  const [email, setEmail] = useState(defaultValues?.email ?? "");
  const [phone, setPhone] = useState(defaultValues?.phone ?? "");
  const [cuit, setCuit] = useState(defaultValues?.cuit ?? "");
  const [address, setAddress] = useState(defaultValues?.address ?? "");
  const { mutateAsync: create, isPending: creating } = useCreateSupplier();
  const { mutateAsync: update, isPending: updating } = useUpdateSupplier();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }
    
    const dto = { name, email, phone, cuit, address };

    try {
      if (isEdit && defaultValues?.id) {
        await update({ id: defaultValues.id, dto });
      } else {
        await create(dto);
      }
      onClose();
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "No se pudo guardar");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Nombre *</Label>
        <Input 
          value={name} 
          onChange={e => setName(e.target.value)} 
          className="bg-input border-border"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Email</Label>
        <Input 
          type="email" 
          value={email ?? ""} 
          onChange={e => setEmail(e.target.value)} 
          className="bg-input border-border"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Teléfono</Label>
        <Input 
          value={phone ?? ""}
          onChange={e => setPhone(e.target.value)} 
          className="bg-input border-border"
        />
      </div>
      
      <div className="space-y-2">
        <Label>CUIT</Label>
        <Input 
          value={cuit ?? ""} 
          onChange={e => setCuit(e.target.value)} 
          className="bg-input border-border"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Dirección</Label>
        <Input 
          value={address ?? ""} 
          onChange={e => setAddress(e.target.value)} 
          className="bg-input border-border"
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" className="btn-gradient" disabled={creating || updating}>
          {isEdit ? "Guardar cambios" : "Crear Proveedor"}
        </Button>
      </div>
    </form>
  );
}