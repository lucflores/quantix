import { useState, useEffect } from "react";
import type { MovementsQuery } from "../types";

export const MovementsFilters = ({
  value,
  onChange,
}: {
  value: MovementsQuery;
  onChange: (v: MovementsQuery) => void;
}) => {
  const [state, setState] = useState<MovementsQuery>(value);

  useEffect(() => setState(value), [value]);

  const apply = () => onChange({ ...state, page: 1 });

  return (
    <div className="row g-2">
      <div className="col-12 col-md-2">
        <select
          className="form-select"
          value={state.kind ?? "ALL"}
          onChange={(e) => setState((s) => ({ ...s, kind: e.target.value as any }))}
        >
          <option value="ALL">Todos</option>
          <option value="IN">IN</option>
          <option value="OUT">OUT</option>
        </select>
      </div>
      <div className="col-12 col-md-3">
        <input
          className="form-control"
          placeholder="Buscar por nombre o SKU"
          value={state.q ?? ""}
          onChange={(e) => setState((s) => ({ ...s, q: e.target.value }))}
        />
      </div>
      <div className="col-6 col-md-2">
        <input
          type="date"
          className="form-control"
          value={state.from ?? ""}
          onChange={(e) => setState((s) => ({ ...s, from: e.target.value }))}
        />
      </div>
      <div className="col-6 col-md-2">
        <input
          type="date"
          className="form-control"
          value={state.to ?? ""}
          onChange={(e) => setState((s) => ({ ...s, to: e.target.value }))}
        />
      </div>
      <div className="col-12 col-md-2">
        <select
          className="form-select"
          value={state.sort ?? "date_desc"}
          onChange={(e) => setState((s) => ({ ...s, sort: e.target.value as any }))}
        >
          <option value="date_desc">Fecha ↓</option>
          <option value="date_asc">Fecha ↑</option>
        </select>
      </div>
      <div className="col-12 col-md-1 d-grid">
        <button className="btn btn-primary" onClick={apply}>
          Filtrar
        </button>
      </div>
    </div>
  );
};
