import { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Stock.css";

export default function Stock() {
  const [search, setSearch] = useState("");
  const [proveedor, setProveedor] = useState("");

  const productos = [
    { codigo: "P001", nombre: "Tela Algodón", proveedor: "Textil S.A.", disponible: 120, reservado: 10 },
    { codigo: "P002", nombre: "Cinta Satinada", proveedor: "Lazos SRL", disponible: 80, reservado: 15 },
    { codigo: "P003", nombre: "Botón Metal", proveedor: "Accesorios SRL", disponible: 200, reservado: 25 },
    { codigo: "P004", nombre: "Hilo Rojo", proveedor: "Textil S.A.", disponible: 60, reservado: 5 },
  ];

  const productosFiltrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(search.toLowerCase()) &&
      (proveedor === "" || p.proveedor === proveedor)
  );

  const proveedoresUnicos = [...new Set(productos.map((p) => p.proveedor))];

  return (
    <div className="stock-container container-fluid pt-4 px-4">
      <div className="stock-card bg-light text-center rounded p-4">
        <div className="stock-header d-flex align-items-center justify-content-between mb-4">
          <h6 className="mb-0">Listado de Stock</h6>

          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "200px" }}
            />

            <select
              className="form-select form-select-sm"
              value={proveedor}
              onChange={(e) => setProveedor(e.target.value)}
              style={{ width: "180px" }}
            >
              <option value="">Todos los proveedores</option>
              {proveedoresUnicos.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table text-start align-middle table-bordered table-hover mb-0">
            <thead>
              <tr className="text-dark">
                <th scope="col">Código</th>
                <th scope="col">Nombre</th>
                <th scope="col">Proveedor</th>
                <th scope="col">Stock Disponible</th>
                <th scope="col">Stock Reservado</th>
                <th scope="col">Stock Total</th>
                <th scope="col">Acción</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.length > 0 ? (
                productosFiltrados.map((p) => (
                  <tr key={p.codigo}>
                    <td>{p.codigo}</td>
                    <td>{p.nombre}</td>
                    <td>{p.proveedor}</td>
                    <td className="text-success fw-semibold">{p.disponible}</td>
                    <td className="text-danger fw-semibold">{p.reservado}</td>
                    <td className="fw-semibold">{p.disponible + p.reservado}</td>
                    <td>
                      <button className="btn btn-sm btn-primary">
                        <i className="bi bi-pencil"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-muted py-3">
                    No se encontraron productos
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
