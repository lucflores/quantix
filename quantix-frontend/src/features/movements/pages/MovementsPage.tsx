// ESTO QUEDA COMO UN EJEMPLO DE PAGINA CON FILTROS LOCALES, NO SE USA

import { useMemo, useState } from "react";
import { useMovements } from "../hooks/useMovements";
import type { MovementsQuery } from "../types";
import { MovementsFilters } from "../components/MovementsFilters";
import { MovementsTable } from "../components/MovementsTable";
import { Pagination } from "../components/Pagination";
import { applyLocalFilters } from "../api/localFilter";

export const MovementsPage = () => {
  const [filters, setFilters] = useState<MovementsQuery>({
    kind: "ALL",
    sort: "date_desc",
    page: 1,
    pageSize: 20,
  });

  const { data, isLoading, isError, error, refetch, isFetching } = useMovements(filters);

  const { rows, pages, total } = useMemo(() => {
    if (!data) return { rows: [], pages: 1, total: 0 };
    return applyLocalFilters(data, filters);
  }, [data, filters]);

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="mb-0">Movimientos de inventario</h3>
        <div className="d-flex align-items-center gap-2">
          <small className="text-muted">{total} resultados</small>
          <button className="btn btn-outline-secondary btn-sm" onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? "Actualizando..." : "Actualizar"}
          </button>
        </div>
      </div>

      <div className="mb-3">
        <MovementsFilters value={filters} onChange={setFilters} />
      </div>

      {isLoading && <div className="alert alert-info">Cargando movimientos…</div>}
      {isError && (
        <div className="alert alert-danger">Error: {(error as any)?.message ?? "No se pudo cargar"}</div>
      )}

      {!!rows.length && (
        <>
          <div className="d-flex justify-content-end mb-2">
            <Pagination
              page={filters.page ?? 1}
              pages={pages}
              onPage={(p) => setFilters((s) => ({ ...s, page: p }))}
            />
          </div>
          <MovementsTable rows={rows} />
          <div className="d-flex justify-content-end mt-2">
            <Pagination
              page={filters.page ?? 1}
              pages={pages}
              onPage={(p) => setFilters((s) => ({ ...s, page: p }))}
            />
          </div>
        </>
      )}

      {data && rows.length === 0 && (
        <div className="alert alert-warning">No hay movimientos con los filtros aplicados.</div>
      )}
    </div>
  );
};
