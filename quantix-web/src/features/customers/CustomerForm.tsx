import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCreateCustomer, useUpdateCustomer } from "./hooks/useCustomers";

type Props = {
  onClose: () => void;
  defaultValues?: { id?: string; name?: string; email?: string; phone?: string };
};

export default function CustomerForm({ onClose, defaultValues }: Props) {
  const isEdit = !!defaultValues?.id;
  const [name, setName] = useState(defaultValues?.name ?? "");
  const [email, setEmail] = useState(defaultValues?.email ?? "");
  const [phone, setPhone] = useState(defaultValues?.phone ?? "");

  const { mutateAsync: create, isPending: creating } = useCreateCustomer();
  const { mutateAsync: update, isPending: updating } = useUpdateCustomer();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }
    try {
      if (isEdit && defaultValues?.id) {
        await update({ id: defaultValues.id, dto: { name, email, phone } });
      } else {
        await create({ name, email, phone });
      }
      onClose();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "No se pudo guardar");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Nombre *</Label>
        <Input value={name} onChange={e => setName(e.target.value)} className="bg-input border-border"/>
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-input border-border"/>
      </div>
      <div className="space-y-2">
        <Label>Teléfono</Label>
        <Input value={phone} onChange={e => setPhone(e.target.value)} className="bg-input border-border"/>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        <Button type="submit" className="btn-gradient" disabled={creating || updating}>
          {isEdit ? "Guardar cambios" : "Crear cliente"}
        </Button>
      </div>
    </form>
  );
}
