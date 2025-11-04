import { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./PartnersList.css";

interface Socio {
  id: number;
  nombre: string;
  comentario: string;
  saldo: number;
}

export default function Socios() {
  const [search, setSearch] = useState<string>("");
  const [socios, setSocios] = useState<Socio[]>([
    { id: 1, nombre: "Juan Pérez", comentario: "Socio activo", saldo: 1500 },
    { id: 2, nombre: "María Gómez", comentario: "Retraso en pagos", saldo: -200 },
    { id: 3, nombre: "Carlos Díaz", comentario: "Pagos al día", saldo: 0 },
  ]);

  const sociosFiltrados = socios.filter((s) =>
    s.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const handleAgregar = () => {
    const nombre = prompt("Ingrese el nombre del nuevo socio:");
    if (!nombre) return;

    const comentario = prompt("Ingrese un comentario:") ?? "";
    const saldoInput = prompt("Ingrese el saldo inicial (puede ser 0):");
    const saldo = saldoInput ? parseFloat(saldoInput) : 0;

    const nuevoSocio: Socio = {
      id: Date.now(),
      nombre,
      comentario,
      saldo,
    };

    setSocios((prev) => [...prev, nuevoSocio]);
  };

  return (
    <div className="stock-container container-fluid pt-4 px-4">
      <div className="stock-card bg-light text-center rounded p-4">
        <div className="stock-header d-flex align-items-center justify-content-between mb-4">
          <h6 className="mb-0">Listado de Socios</h6>

          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Buscar socio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "200px" }}
            />

            <button className="btn btn-sm btn-success" onClick={handleAgregar}>
              <i className="bi bi-person-plus"></i> Agregar
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table text-start align-middle table-bordered table-hover mb-0">
            <thead>
              <tr className="text-dark">
                <th scope="col">Nombre</th>
                <th scope="col">Comentario</th>
                <th scope="col">Saldo</th>
                <th scope="col">Editar</th>
              </tr>
            </thead>
            <tbody>
              {sociosFiltrados.length > 0 ? (
                sociosFiltrados.map((s) => (
                  <tr key={s.id}>
                    <td>{s.nombre}</td>
                    <td>{s.comentario}</td>
                    <td
                      className={
                        s.saldo > 0
                          ? "text-success fw-semibold"
                          : s.saldo < 0
                          ? "text-danger fw-semibold"
                          : "fw-semibold"
                      }
                    >
                      ${s.saldo}
                    </td>
                    <td>
                      <button className="btn btn-sm btn-primary">
                        <i className="bi bi-pencil"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-muted py-3">
                    No se encontraron socios
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
