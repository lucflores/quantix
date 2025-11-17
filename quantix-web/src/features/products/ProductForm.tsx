import { useEffect, useState } from "react";
import { api } from "@/core/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export interface Product {
  id?: string;
  sku: string;
  name: string;
  cost: number;
  price: number;
  stock: number;
  minStock: number;
  active: boolean;
  unit?: string;
}

interface ProductFormProps {
  product?: Product;     // si viene → editar
  onSuccess: () => void; // callback al terminar OK
}

export const ProductForm = ({ product, onSuccess }: ProductFormProps) => {
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

  const [initialActive, setInitialActive] = useState<boolean | null>(null);

  // Cargar datos en edición / limpiar en creación
  useEffect(() => {
    if (product) {
      setFormData({
        sku: product.sku,
        name: product.name,
        cost: String(product.cost),
        price: String(product.price),
        stock: String(product.stock ?? ""),
        minStock: String(product.minStock ?? ""),
        active: product.active,
        unit: product.unit || "UNIT",
      });
      setInitialActive(product.active);
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
      setInitialActive(null);
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.sku || !formData.name || !formData.cost || !formData.price) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      if (product?.id) {
        // ================== EDITAR ==================
        await api.put(`/products/${product.id}`, {
          sku: formData.sku,
          name: formData.name,
          cost: formData.cost,
          price: formData.price,
          minStock: formData.minStock || "0",
          // unit, stock y active NO se manejan por este endpoint
        });

        // Si cambió el switch de activo, llamamos al mismo endpoint que la tabla
        if (initialActive !== null && initialActive !== formData.active) {
          try {
            await api.patch(`/products/${product.id}/status`, {
              active: formData.active,
            });
          } catch (err: any) {
            const msg =
              err?.response?.data?.error ||
              (err?.response?.status === 409
                ? "No se puede desactivar un producto con stock > 0"
                : "No se pudo cambiar el estado");
            toast.error(msg);
            // no cortamos, igual consideramos la edición de datos como exitosa
          }
        }

        toast.success("Producto actualizado correctamente");
      } else {
        // ================== CREAR ==================
        await api.post("/products", {
          sku: formData.sku,
          name: formData.name,
          cost: formData.cost,
          price: formData.price,
          stock: formData.stock || "0",
          minStock: formData.minStock || "0",
          unit: formData.unit,
          active: formData.active,
        });

        toast.success("Producto creado correctamente");
      }

      onSuccess();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Error al guardar el producto");
    }
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
          />
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="name">Nombre del Producto *</Label>
          <Input
            id="name"
            placeholder="Laptop Dell XPS 13"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Precio *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            placeholder="1200.00"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />
        </div>

        {/* Solo en crear mostramos stock inicial explícitamente */}
        {!product && (
          <div className="space-y-2">
            <Label htmlFor="stock">Stock Inicial</Label>
            <Input
              id="stock"
              type="number"
              placeholder="15"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
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
            onChange={(e) =>
              setFormData({ ...formData, minStock: e.target.value })
            }
          />
        </div>

        <div className="col-span-2 flex items-center justify-between p-4 rounded-lg bg-muted/30">
          <div>
            <Label htmlFor="active">Producto Activo</Label>
            <p className="text-sm text-muted-foreground">
              El producto estará disponible para ventas
            </p>
          </div>
          <Switch
            id="active"
            checked={formData.active}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, active: checked })
            }
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="submit" className="btn-gradient">
          {product ? "Guardar cambios" : "Crear Producto"}
        </Button>
      </div>
    </form>
  );
};
