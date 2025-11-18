import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"; 
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useCreateProduct, useUpdateProduct } from "./hooks/useProducts";
import type { Product } from "./types"; 

interface ProductFormProps {
  product?: Product;
  onSuccess: () => void;
}

export const ProductForm = ({ product, onSuccess }: ProductFormProps) => {
  const { mutateAsync: create, isPending: creating } = useCreateProduct();
  const { mutateAsync: update, isPending: updating } = useUpdateProduct();
  const isPending = creating || updating;

  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    cost: "",
    price: "",
    stock: "",
    minStock: "",
    active: true,
    unit: "UNIT", 
  });

  useEffect(() => {
    if (product) {
      setFormData({
        sku: product.sku,
        name: product.name,
        cost: String(product.cost),
        price: String(product.price),
        stock: String(product.stock ?? "0"),
        minStock: String(product.minStock ?? "0"),
        active: product.active,
        unit: product.unit || "UNIT", 
      });
    } else {
      setFormData({
        sku: "",
        name: "",
        cost: "",
        price: "",
        stock: "",
        minStock: "",
        active: true,
        unit: "UNIT",
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.sku || !formData.name || !formData.cost || !formData.price) {
      toast.error("Por favor completa los campos obligatorios (*)");
      return;
    }

    try {
      const payload = {
        sku: formData.sku,
        name: formData.name,
        cost: parseFloat(formData.cost),
        price: parseFloat(formData.price),
        minStock: parseFloat(formData.minStock || "0"),
        active: formData.active,
        unit: formData.unit,
      };

      if (product?.id) {
        await update({
          id: product.id,
          dto: payload
        });
        toast.success("Producto actualizado");
      } else {
        await create({
          ...payload,
          stock: parseFloat(formData.stock || "0"),
        });
        toast.success("Producto creado");
      }
      onSuccess();
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Error al guardar";
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sku">SKU *</Label>
          <Input
            id="sku"
            placeholder="Ej: PROD-001"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            disabled={isPending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unidad de Medida</Label>
          <Select
            value={formData.unit}
            onValueChange={(val) => setFormData({ ...formData, unit: val })}
            disabled={isPending}
          >
            <SelectTrigger id="unit" className="bg-input border-border">
              <SelectValue placeholder="Seleccionar..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UNIT">Unidad (u)</SelectItem>
              <SelectItem value="KG">Kilogramos (kg)</SelectItem>
              <SelectItem value="LT">Litros (l)</SelectItem>
              <SelectItem value="M">Metros (m)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="name">Nombre del Producto *</Label>
          <Input
            id="name"
            placeholder="Ej: Coca Cola 2L"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={isPending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cost">Costo *</Label>
          <Input
            id="cost"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            disabled={isPending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Precio *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            disabled={isPending}
          />
        </div>

        {!product && (
          <div className="space-y-2">
            <Label htmlFor="stock">Stock Inicial</Label>
            <Input
              id="stock"
              type="number"
              placeholder="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              disabled={isPending}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="minStock">Stock Mínimo</Label>
          <Input
            id="minStock"
            type="number"
            placeholder="5"
            value={formData.minStock}
            onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
            disabled={isPending}
          />
        </div>

        <div className="col-span-2 flex items-center justify-between p-4 rounded-lg bg-muted/30">
          <div>
            <Label htmlFor="active">Producto Activo</Label>
            <p className="text-sm text-muted-foreground">
              Disponible para ventas
            </p>
          </div>
          <Switch
            id="active"
            checked={formData.active}
            onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
            disabled={isPending}
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="submit" className="btn-gradient" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {product ? "Guardar cambios" : "Crear Producto"}
        </Button>
      </div>
    </form>
  );
};