import { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./StockMov.css";

export default function StockMov() {
  const [search, setSearch] = useState("");
  const [evento, setEvento] = useState("");

  const movimientos = [
    {
      id: 1,
      evento: "Ingreso",
      nombre: "Tela Algodón",
      stockAnterior: 100,
      stockActual: 120,
      fecha: "2025-10-12",
    },
    {
      id: 2,
      evento: "Egreso",
      nombre: "Cinta Satinada",
      stockAnterior: 80,
      stockActual: 70,
      fecha: "2025-10-13",
    },
    {
      id: 3,
      evento: "Ajuste",
      nombre: "Botón Metal",
      stockAnterior: 200,
      stockActual: 195,
      fecha: "2025-10-13",
    },
  ];

  // Filtrar por nombre y evento
  const movimientosFiltrados = movimientos.filter(
    (m) =>
      m.nombre.toLowerCase().includes(search.toLowerCase()) &&
      (evento === "" || m.evento === evento)
  );

  const eventosUnicos = [...new Set(movimientos.map((m) => m.evento))];

  return (
    <div className="movimientos-container container-fluid pt-4 px-4">
      <div className="movimientos-card bg-light text-center rounded p-4">
        <div className="movimientos-header d-flex align-items-center justify-content-between mb-4">
          <h6 className="mb-0">Movimientos de Stock</h6>

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
              value={evento}
              onChange={(e) => setEvento(e.target.value)}
              style={{ width: "150px" }}
            >
              <option value="">Todos los eventos</option>
              {eventosUnicos.map((ev) => (
                <option key={ev} value={ev}>
                  {ev}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table text-start align-middle table-bordered table-hover mb-0">
            <thead>
              <tr className="text-dark">
                <th scope="col">Evento</th>
                <th scope="col">Nombre</th>
                <th scope="col">Stock Anterior</th>
                <th scope="col">Stock Actual</th>
                <th scope="col">Diferencia</th>
                <th scope="col">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {movimientosFiltrados.length > 0 ? (
                movimientosFiltrados.map((m) => {
                  const diferencia = m.stockActual - m.stockAnterior;
                  return (
                    <tr key={m.id}>
                      <td>
                        <span
                          className={`badge ${
                            m.evento === "Ingreso"
                              ? "bg-success"
                              : m.evento === "Egreso"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {m.evento}
                        </span>
                      </td>
                      <td>{m.nombre}</td>
                      <td>{m.stockAnterior}</td>
                      <td>{m.stockActual}</td>
                      <td
                        className={`fw-semibold ${
                          diferencia > 0
                            ? "text-success"
                            : diferencia < 0
                            ? "text-danger"
                            : "text-muted"
                        }`}
                      >
                        {diferencia > 0 ? "+" : ""}
                        {diferencia}
                      </td>
                      <td>{m.fecha}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-muted py-3">
                    No se encontraron movimientos
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
