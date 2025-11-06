import { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./PartnersList.css";

interface Movimiento {
  id: number;
  nombre: string;
  fecha: string;
  saldo: number;
}

interface Socio {
  id: number;
  nombre: string;
}

export default function MovimientosConSelect() {
  const [search, setSearch] = useState<string>("");
  const [socioSeleccionado, setSocioSeleccionado] = useState<string>("");

  const socios: Socio[] = [
    { id: 1, nombre: "Juan Pérez" },
    { id: 2, nombre: "María Gómez" },
    { id: 3, nombre: "Carlos Díaz" },
    { id: 4, nombre: "Ana López" },
  ];

  const [movimientos] = useState<Movimiento[]>([
    { id: 1, nombre: "Juan Pérez", fecha: "2025-11-01", saldo: 1500 },
    { id: 2, nombre: "María Gómez", fecha: "2025-10-25", saldo: -350 },
    { id: 3, nombre: "Carlos Díaz", fecha: "2025-09-30", saldo: 0 },
    { id: 4, nombre: "Ana López", fecha: "2025-09-15", saldo: 850 },
  ]);

  // 🔎 Filtro por nombre o socio seleccionado
  const movimientosFiltrados = movimientos.filter((m) => {
    const coincideBusqueda = m.nombre.toLowerCase().includes(search.toLowerCase());
    const coincideSocio = socioSeleccionado === "" || m.nombre === socioSeleccionado;
    return coincideBusqueda && coincideSocio;
  });

  return (
    <div className="stock-container container-fluid pt-4 px-4">
      <div className="stock-card bg-light text-center rounded p-4">
        <div className="stock-header d-flex align-items-center justify-content-between mb-4">
          <h6 className="mb-0">Cuentas Corrientes</h6>

          <div className="d-flex gap-2">
            {/* Campo de búsqueda */}
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Buscar por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "200px" }}
            />

            {/* Selector de socio */}
            <select
              className="form-select form-select-sm"
              value={socioSeleccionado}
              onChange={(e) => setSocioSeleccionado(e.target.value)}
              style={{ width: "200px" }}
            >
              <option value="">Seleccionar socio...</option>
              {socios.map((s) => (
                <option key={s.id} value={s.nombre}>
                  {s.nombre}
                </option>
              ))}
            </select>

            {/* Botón que navega a la página nueva */}
            <Link to="new" className="btn btn-sm btn-success">
              <i className="bi bi-plus-lg"></i> Nueva transacción
            </Link>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table text-start align-middle table-bordered table-hover mb-0">
            <thead>
              <tr className="text-dark">
                <th scope="col">Nombre</th>
                <th scope="col">Fecha</th>
                <th scope="col">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {movimientosFiltrados.length > 0 ? (
                movimientosFiltrados.map((m) => (
                  <tr key={m.id}>
                    <td>{m.nombre}</td>
                    <td>{m.fecha}</td>
                    <td
                      className={
                        m.saldo > 0
                          ? "text-success fw-semibold"
                          : m.saldo < 0
                          ? "text-danger fw-semibold"
                          : "fw-semibold"
                      }
                    >
                      ${m.saldo}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-muted py-3">
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
