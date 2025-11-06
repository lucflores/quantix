import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface CustomerFormProps {
  onSuccess: () => void;
}

export const CustomerForm = ({ onSuccess }: CustomerFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Por favor completa los campos requeridos');
      return;
    }
    toast.success('Cliente creado correctamente');
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre *</Label>
        <Input
          id="name"
          placeholder="Carlos Mendoza"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="bg-input border-border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          placeholder="carlos@email.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="bg-input border-border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono</Label>
        <Input
          id="phone"
          placeholder="555-0101"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="bg-input border-border"
        />
      </div>

      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
        <div>
          <Label htmlFor="active" className="cursor-pointer">Cliente Activo</Label>
          <p className="text-sm text-muted-foreground">El cliente podrá realizar compras</p>
        </div>
        <Switch
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
        />
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancelar
        </Button>
        <Button type="submit" className="btn-gradient">
          Crear Cliente
        </Button>
      </div>
    </form>
  );
};
