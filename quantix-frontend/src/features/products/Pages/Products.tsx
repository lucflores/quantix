import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";

export default function Products() {
  const { data: products, isLoading, isError, error } = useProducts();

  if (isLoading) {
    return (
      <div className="container-fluid pt-4 px-4">
        <div className="alert alert-info">Cargando productos...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container-fluid pt-4 px-4">
        <div className="alert alert-danger">
          Error: {(error as any)?.message ?? "No se pudo cargar"}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid pt-4 px-4">
      <div className="bg-light text-center rounded p-4">
        {/* Encabezado con botón */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h6 className="mb-0">Productos</h6>
          <Link to="new" className="btn btn-sm btn-primary">
            Nuevo Producto
          </Link>
        </div>

        {/* Tabla de productos */}
        <div className="table-responsive">
          <table className="table text-start align-middle table-bordered table-hover mb-0">
            <thead>
              <tr className="text-dark">
                <th style={{ width: "80px" }}>SKU</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th style={{ width: "120px" }}>Precio</th>
                <th style={{ width: "120px" }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((p) => (
                <tr key={p.id}>
                  <td>{p.sku}</td>
                  <td>{p.name}</td>
                  <td>{p.description}</td>
                  <td>${p.price.toFixed(2)}</td>
                  <td>
                    <button className="btn btn-sm btn-primary">Detalle</button>
                  </td>
                </tr>
              ))}

              {!products?.length && (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    No hay productos disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
