import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProductTable } from "./ProductTable";
import { ProductForm } from "./ProductForm";
import type { Product } from "./types";
import { useProducts, useToggleProductStatus } from "./hooks/useProducts";

export const ProductsPage = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const { data: productsResponse, isLoading } = useProducts(page, limit, search);
  const { mutateAsync: toggleStatus } = useToggleProductStatus();
  const totalPages = productsResponse?.totalPages ?? 1;
  const nextPage = () => { if (page < totalPages) setPage(page + 1); };
  const prevPage = () => { if (page > 1) setPage(page - 1); };
  const handleToggleStatus = async (id: string, currentActive: boolean) => {
    await toggleStatus({ id, active: !currentActive });
  };

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
              className="pl-10 bg-input border-border"
              placeholder="Buscar por nombre o SKU..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        <ProductTable
          data={productsResponse}
          isLoading={isLoading}
          onEdit={(product) => {
            setProductToEdit(product);
            setIsEditOpen(true);
          }}
          onToggleStatus={handleToggleStatus}
        />

        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages} (Total: {productsResponse?.totalResults ?? 0} productos)
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={prevPage} disabled={page === 1}>
              Anterior
            </Button>
            <Button variant="outline" size="sm" onClick={nextPage} disabled={page >= totalPages}>
              Siguiente
            </Button>
          </div>
        </div>
      </Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle>Nuevo Producto</DialogTitle>
          </DialogHeader>
          <ProductForm
            onSuccess={() => setIsCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
          </DialogHeader>
          {productToEdit && (
            <ProductForm
              product={productToEdit}
              onSuccess={() => {
                setIsEditOpen(false);
                setProductToEdit(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};