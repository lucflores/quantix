import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, DollarSign, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAllProducts } from '@/features/products/hooks/useProducts';
import { useAllCustomers } from '@/features/customers/hooks/useCustomers';
import { useCreateSale } from './hooks/useSales';

export const SaleForm = () => {
  const [paymentMethod, setPaymentMethod] = useState<'EFECTIVO' | 'CTA_CTE'>('EFECTIVO');
  const [customerId, setCustomerId] = useState<string>('');
  const [items, setItems] = useState<Array<{ productId: string; quantity: string }>>([
    { productId: '', quantity: '' },
  ]);
  const { data: productsData, isLoading: loadingProducts } = useAllProducts();
  const { data: customersData, isLoading: loadingCustomers } = useAllCustomers();
  const { mutateAsync: createSale, isPending } = useCreateSale();
  const productList = productsData || [];
  const customerList = customersData || [];
  const addItem = () => setItems((prev) => [...prev, { productId: '', quantity: '' }]);
  const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));
  const handleItemChange = (index: number, field: 'productId' | 'quantity', value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'CTA_CTE' && !customerId) {
      toast.error('Debe seleccionar un cliente para cuenta corriente');
      return;
    }
    for (const it of items) {
      if (!it.productId) {
        toast.error('Seleccioná un producto en cada línea');
        return;
      }
      const qty = parseFloat(it.quantity);
      if (isNaN(qty) || qty <= 0) {
        toast.error('La cantidad debe ser un número mayor a 0');
        return;
      }
      const p = productList.find((x) => x.id === it.productId);
      if (!p) {
        toast.error('Producto inválido');
        return;
      }
    }

    try {
      const payload = {
        payment: paymentMethod,
        customerId: paymentMethod === 'CTA_CTE' ? customerId : undefined,
        items: items.map((it) => {
          const p = productList.find((x) => x.id === it.productId)!;
          return { 
            productId: it.productId, 
            quantity: parseFloat(it.quantity), 
            unitPrice: parseFloat(p.price as string) 
          };
        }),
      };
      
      await createSale(payload);

      setPaymentMethod('EFECTIVO');
      setCustomerId('');
      setItems([{ productId: '', quantity: '' }]);
      
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'No se pudo registrar la venta';
      toast.error(msg);
    }
  };

  const formDisabled = isPending || loadingProducts || loadingCustomers;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Método de Pago</Label>
        <Select 
          value={paymentMethod} 
          onValueChange={(v) => setPaymentMethod(v as any)}
          disabled={formDisabled}
        >
          <SelectTrigger className="bg-input border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="EFECTIVO">Efectivo</SelectItem>
            <SelectItem value="CTA_CTE">Cuenta Corriente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {paymentMethod === 'CTA_CTE' && (
        <div className="space-y-2">
          <Label>Cliente *</Label>
          <Select 
            value={customerId} 
            onValueChange={setCustomerId}
            disabled={formDisabled}
          >
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder={loadingCustomers ? 'Cargando...' : 'Seleccionar cliente'} />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {customerList.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-3">
        <Label>Productos</Label>
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            
            <Select
              value={item.productId}
              onValueChange={(val) => handleItemChange(index, 'productId', val)}
              disabled={formDisabled}
            >
              <SelectTrigger className="flex-1 bg-input border-border">
                <SelectValue placeholder={loadingProducts ? 'Cargando...' : 'Seleccionar producto'} />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {productList.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} — ${p.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Cant."
              value={item.quantity}
              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
              className="w-24 bg-input border-border"
              min="0.001"
              step="0.001"
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
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <DollarSign className="w-4 h-4 mr-2" />
        )}
        {isPending ? 'Registrando...' : 'Registrar Venta'}
      </Button>
    </form>
  );
};