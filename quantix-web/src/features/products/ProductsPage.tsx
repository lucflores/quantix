import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { ProductTable } from "./ProductTable";
import { ProductForm, Product } from "./ProductForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const ProductsPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey(k => k + 1);

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Productos</h1>
          <p className="text-muted-foreground">Gestión de inventario y stock</p>
        </div>

        <Button onClick={() => setIsCreateOpen(true)} className="btn-gradient">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      <Card className="p-6 glass-card">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <ProductTable
          searchTerm={searchTerm}
          refreshKey={refreshKey}
          onEdit={(product) => {
            setProductToEdit(product);
            setIsEditOpen(true);
          }}
        />
      </Card>


      {/* === MODAL CREAR === */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nuevo Producto</DialogTitle>
          </DialogHeader>

          <ProductForm
            onSuccess={() => {
              setIsCreateOpen(false);
              refresh();
            }}
          />
        </DialogContent>
      </Dialog>


      {/* === MODAL EDITAR → AHORA SE MONTA ACÁ Y FUNCIONA! === */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
          </DialogHeader>

          {productToEdit && (
            <ProductForm
              product={productToEdit}
              onSuccess={() => {
                setIsEditOpen(false);
                setProductToEdit(null);
                refresh();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
};
