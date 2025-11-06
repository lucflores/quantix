import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useCustomers } from '@/features/customers/hooks/useCustomers';
import { useCreateSale } from './hooks/useSales';

export const SaleForm = () => {
  const [paymentMethod, setPaymentMethod] = useState<'EFECTIVO' | 'CTA_CTE'>('EFECTIVO');
  const [customerId, setCustomerId] = useState<string>('');
  const [items, setItems] = useState<Array<{ productId: string; quantity: string }>>([
    { productId: '', quantity: '' },
  ]);

  const { data: products, isLoading: loadingProducts } = useProducts();
  const { data: customers, isLoading: loadingCustomers } = useCustomers();
  const { mutateAsync: createSale, isPending } = useCreateSale();

  const productList = Array.isArray(products) ? products : [];
  const customerList = Array.isArray(customers) ? customers : [];

  const addItem = () => setItems((prev) => [...prev, { productId: '', quantity: '' }]);
  const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'CTA_CTE' && !customerId) {
      toast.error('Debe seleccionar un cliente para cuenta corriente');
      return;
    }

    // Validaciones básicas
    for (const it of items) {
  if (!it.productId) {
    toast.error('Seleccioná un producto en cada línea');
    return;
  }
  const qty = Number(it.quantity);
  if (!Number.isFinite(qty) || qty <= 0) {
    toast.error('La cantidad debe ser un número mayor a 0');
    return;
  }
  const p = productList.find((x) => x.id === it.productId);
  const priceNum = Number(p?.price);
  if (!Number.isFinite(priceNum) || priceNum < 0) {
    toast.error('El precio del producto es inválido');
    return;
  }
}

    try {
      const payload = {
  payment: paymentMethod,
  customerId: paymentMethod === 'CTA_CTE' ? customerId : undefined,
  items: items.map((it) => {
    const p = productList.find((x) => x.id === it.productId);
    const unitPrice = Number(p?.price);        // 👈 casteamos a número
    const quantity = Number(it.quantity);      // 👈 casteamos a número
    return { productId: it.productId, quantity, unitPrice };
  }),
};
await createSale(payload);

      toast.success('Venta registrada correctamente');
      setPaymentMethod('EFECTIVO');
      setCustomerId('');
      setItems([{ productId: '', quantity: '' }]);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'No se pudo registrar la venta';
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Método de Pago</Label>
        <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
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
          <Select value={customerId} onValueChange={setCustomerId}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder={loadingCustomers ? 'Cargando...' : 'Seleccionar cliente'} />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {loadingCustomers && (
                <div className="px-3 py-2 text-sm text-muted-foreground">Cargando...</div>
              )}
              {!loadingCustomers && customerList.length === 0 && (
                <div className="px-3 py-2 text-sm text-muted-foreground">Sin clientes</div>
              )}
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
              onValueChange={(value) => {
                const next = [...items];
                next[index].productId = value;
                setItems(next);
              }}
            >
              <SelectTrigger className="flex-1 bg-input border-border">
                <SelectValue placeholder={loadingProducts ? 'Cargando...' : 'Seleccionar producto'} />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {loadingProducts && (
                  <div className="px-3 py-2 text-sm text-muted-foreground">Cargando...</div>
                )}
                {!loadingProducts && productList.length === 0 && (
                  <div className="px-3 py-2 text-sm text-muted-foreground">Sin productos</div>
                )}
                {productList.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} — ${p.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Cantidad"
              value={item.quantity}
              onChange={(e) => {
                const next = [...items];
                next[index].quantity = e.target.value;
                setItems(next);
              }}
              className="w-28 bg-input border-border"
              min="0.001"
              step="0.001"
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

      <Button type="submit" className="w-full btn-gradient" disabled={isPending}>
        <DollarSign className="w-4 h-4 mr-2" />
        {isPending ? 'Registrando...' : 'Registrar Venta'}
      </Button>
    </form>
  );
};
