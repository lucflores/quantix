import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface ProductFormProps {
  onSuccess: () => void;
}

export const ProductForm = ({ onSuccess }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    cost: '',
    price: '',
    stock: '',
    minStock: '',
    active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.sku || !formData.name || !formData.cost || !formData.price) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    // Mock success
    toast.success('Producto creado correctamente');
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sku">SKU *</Label>
          <Input
            id="sku"
            placeholder="PROD-001"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            className="bg-input border-border"
          />
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="name">Nombre del Producto *</Label>
          <Input
            id="name"
            placeholder="Laptop Dell XPS 13"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-input border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cost">Costo *</Label>
          <Input
            id="cost"
            type="number"
            step="0.01"
            placeholder="850.00"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            className="bg-input border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Precio de Venta *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            placeholder="1200.00"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="bg-input border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock Inicial</Label>
          <Input
            id="stock"
            type="number"
            placeholder="15"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            className="bg-input border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="minStock">Stock Mínimo</Label>
          <Input
            id="minStock"
            type="number"
            placeholder="5"
            value={formData.minStock}
            onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
            className="bg-input border-border"
          />
        </div>

        <div className="col-span-2 flex items-center justify-between p-4 rounded-lg bg-muted/30">
          <div>
            <Label htmlFor="active" className="cursor-pointer">Producto Activo</Label>
            <p className="text-sm text-muted-foreground">El producto estará disponible para ventas</p>
          </div>
          <Switch
            id="active"
            checked={formData.active}
            onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancelar
        </Button>
        <Button type="submit" className="btn-gradient">
          Crear Producto
        </Button>
      </div>
    </form>
  );
};
