import { useState, useMemo } from "react";
import { useMovements } from "../hooks/useMovements";
import { MovementsFilters } from "../components/MovementsFilters";
import type { MovementsQuery } from "../types";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./StockMov.css";

export default function StockMov() {
  const [filters, setFilters] = useState<MovementsQuery>({
    kind: "ALL",
    sort: "date_desc",
    page: 1,
    pageSize: 100,
  });

  const { data: movimientos, isLoading, isError, refetch, isFetching } = useMovements(filters);

  // 🔹 Filtrado local
  const movimientosFiltrados = useMemo(() => {
    if (!movimientos) return [];
    let lista = [...movimientos];

    // filtro por texto
    if (filters.q) {
      const q = filters.q.toLowerCase();
      lista = lista.filter(
        (m) => m.nombre.toLowerCase().includes(q) || m.sku?.toLowerCase().includes(q)
      );
    }

    // filtro por fecha
    if (filters.from) lista = lista.filter((m) => m.fecha >= filters.from);
    if (filters.to) lista = lista.filter((m) => m.fecha <= filters.to);

    // filtro por tipo
    if (filters.kind !== "ALL") lista = lista.filter((m) => m.kind === filters.kind);

    return lista;
  }, [movimientos, filters]);

  if (isLoading) return <div className="alert alert-info">Cargando movimientos…</div>;
  if (isError) return <div className="alert alert-danger">Error al cargar los movimientos.</div>;

  return (
    <div className="movimientos-container container-fluid pt-4 px-4">
      <div className="movimientos-card bg-light text-center rounded p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h6 className="mb-0">Movimientos de Stock</h6>

          <div className="d-flex gap-2">
            <small className="text-muted">
              {movimientosFiltrados.length} resultados
            </small>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              {isFetching ? "Actualizando..." : "Actualizar"}
            </button>
          </div>
        </div>

        {/* 🔹 Filtros */}
        <div className="mb-3">
          <MovementsFilters value={filters} onChange={setFilters} />
        </div>

        <div className="table-responsive">
          <table className="table text-start align-middle table-bordered table-hover mb-0">
            <thead>
              <tr className="text-dark">
                <th>Evento</th>
                <th>Nombre</th>
                <th>Stock Anterior</th>
                <th>Stock Actual</th>
                <th>Diferencia</th>
                <th>Fecha</th>
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
