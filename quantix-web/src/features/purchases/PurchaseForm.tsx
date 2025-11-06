import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

export const PurchaseForm = () => {
  const [supplier, setSupplier] = useState('');
  const [items, setItems] = useState([{ product: '', quantity: '', cost: '' }]);

  const addItem = () => {
    setItems([...items, { product: '', quantity: '', cost: '' }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplier || items.some(item => !item.product || !item.quantity || !item.cost)) {
      toast.error('Por favor completa todos los campos');
      return;
    }
    toast.success('Compra registrada correctamente');
    setSupplier('');
    setItems([{ product: '', quantity: '', cost: '' }]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Proveedor</Label>
        <Select value={supplier} onValueChange={setSupplier}>
          <SelectTrigger className="bg-input border-border">
            <SelectValue placeholder="Seleccionar proveedor" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="supplier1">Tech Distributor SA</SelectItem>
            <SelectItem value="supplier2">Global Electronics</SelectItem>
            <SelectItem value="supplier3">Premium Supplies</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Productos</Label>
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Select value={item.product} onValueChange={(value) => {
              const newItems = [...items];
              newItems[index].product = value;
              setItems(newItems);
            }}>
              <SelectTrigger className="flex-1 bg-input border-border">
                <SelectValue placeholder="Producto" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="prod1">Laptop Dell XPS 13</SelectItem>
                <SelectItem value="prod2">Mouse Logitech MX Master</SelectItem>
                <SelectItem value="prod3">Teclado Mecánico RGB</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Cantidad"
              value={item.quantity}
              onChange={(e) => {
                const newItems = [...items];
                newItems[index].quantity = e.target.value;
                setItems(newItems);
              }}
              className="w-24 bg-input border-border"
            />
            <Input
              type="number"
              step="0.01"
              placeholder="Costo"
              value={item.cost}
              onChange={(e) => {
                const newItems = [...items];
                newItems[index].cost = e.target.value;
                setItems(newItems);
              }}
              className="w-28 bg-input border-border"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
              disabled={items.length === 1}
              className="text-muted-foreground hover:text-muted-foreground hover:bg-muted/50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addItem} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Producto
        </Button>
      </div>

      <Button type="submit" className="w-full btn-gradient">
        <ShoppingCart className="w-4 h-4 mr-2" />
        Registrar Compra
      </Button>
    </form>
  );
};
