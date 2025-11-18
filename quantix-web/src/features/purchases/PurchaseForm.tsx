import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, ShoppingCart, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useSuppliers } from '@/features/suppliers/hooks/useSuppliers';
import { useAllProducts } from '@/features/products/hooks/useProducts';
import { useCreatePurchase } from './hooks/usePurchases';
import type { CreatePurchaseDto, PurchaseItemDto } from './types';


const INITIAL_ITEM_STATE: PurchaseItemDto = { productId: '', quantity: '', unitCost: '' };

export const PurchaseForm = () => {
  const { mutateAsync: createPurchase, isPending } = useCreatePurchase();
  const { data: suppliersData, isLoading: isLoadingSuppliers } = useSuppliers();
  const { data: productsData, isLoading: isLoadingProducts } = useAllProducts();
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [items, setItems] = useState<PurchaseItemDto[]>([INITIAL_ITEM_STATE]);
  const addItem = () => {
    setItems([...items, INITIAL_ITEM_STATE]);
  };
  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };
  const handleItemChange = (index: number, field: keyof PurchaseItemDto, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };
  const resetForm = () => {
    setSupplierId(null);
    setItems([INITIAL_ITEM_STATE]);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.some(item => !item.productId || !item.quantity || !item.unitCost)) {
      toast.error('Por favor, completa todos los campos de los productos (Producto, Cantidad y Costo).');
      return;
    }

    for (const item of items) {
      const quantity = parseFloat(item.quantity);
      const unitCost = parseFloat(item.unitCost);

      if (isNaN(quantity) || quantity <= 0) {
        toast.error(`La cantidad "${item.quantity}" no es un número válido.`);
        return;
      }
      if (isNaN(unitCost) || unitCost < 0) {
        toast.error(`El costo "${item.unitCost}" no es un número válido.`);
        return;
      }
    }
    
    const dto: CreatePurchaseDto = {
      supplierId: supplierId || null,
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitCost: item.unitCost,
      })),
    };

    try {
      await createPurchase(dto);
      resetForm();
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "No se pudo registrar la compra");
    }
  };
  const suppliers = suppliersData ?? [];
  const products = productsData ?? [];
  const formDisabled = isPending || isLoadingSuppliers || isLoadingProducts;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Proveedor (Opcional)</Label>
        <Select 
          value={supplierId ?? ""} 
          onValueChange={(value) => setSupplierId(value === "__NULL__" ? null : value)} 
          disabled={formDisabled}
        >
          <SelectTrigger className="bg-input border-border">
            <SelectValue placeholder={isLoadingSuppliers ? "Cargando proveedores..." : "Seleccionar proveedor"} />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="__NULL__">(Ninguno)</SelectItem> 
            {suppliers.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Productos</Label>
        {isLoadingProducts && (
          <div className="text-muted-foreground text-sm">
            <Loader2 className="w-4 h-4 mr-2 inline animate-spin" />
            Cargando productos...
          </div>
        )}

        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            
            <Select 
              value={item.productId} 
              onValueChange={(value) => handleItemChange(index, 'productId', value)}
              disabled={formDisabled}
            >
              <SelectTrigger className="flex-1 bg-input border-border">
                <SelectValue placeholder="Producto" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {products.length === 0 && !isLoadingProducts && (
                  <div className="p-2 text-center text-muted-foreground text-sm">No hay productos.</div>
                )}
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} <span className="text-muted-foreground ml-2">({p.sku})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input
              type="number"
              placeholder="Cantidad"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
              className="w-24 bg-input border-border"
              disabled={formDisabled}
            />
            
            <Input
              type="number"
              step="0.01"
              placeholder="Costo"
              value={item.unitCost}
              onChange={(e) => handleItemChange(index, 'unitCost', e.target.value)}
              className="w-28 bg-input border-border"
              disabled={formDisabled}
            />
            
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
              disabled={items.length === 1 || formDisabled}
              className="text-muted-foreground hover:text-muted-foreground hover:bg-muted/50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addItem} 
          className="w-full"
          disabled={formDisabled}
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Producto
        </Button>
      </div>
      <Button type="submit" className="w-full btn-gradient" disabled={formDisabled}>
        {isPending ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <ShoppingCart className="w-4 h-4 mr-2" />
        )}
        {isPending ? "Registrando..." : "Registrar Compra"}
      </Button>
    </form>
  );
};