import { Link } from "react-router-dom";
import { useTransactions } from "../hooks/useTransactions";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./TransactionRegister.css";

export default function TransactionRegister() {
  const { data: transactions, isLoading, isError, refetch, isFetching } = useTransactions();

  if (isLoading) return <div className="alert alert-info">Cargando transacciones...</div>;
  if (isError) return <div className="alert alert-danger">Error al cargar los registros.</div>;

  return (
    <div className="transaction-register-container container-fluid pt-4 px-4">
      <div className="transaction-register-card bg-light text-center rounded p-4">
        <div className="transaction-register-header d-flex align-items-center justify-content-between mb-4">
          <h6 className="mb-0">Registros</h6>
          <div className="d-flex gap-2">
            <small className="text-muted">
              {transactions?.length || 0} resultados
            </small>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              {isFetching ? "Actualizando..." : "Actualizar"}
            </button>
            <Link to="new" className="btn btn-sm btn-primary">
              Nuevo Registro
            </Link>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table text-start align-middle table-bordered table-hover mb-0">
            <thead>
              <tr className="text-dark">
                <th>Fecha</th>
                <th>Comprobante</th>
                <th>Socio</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {transactions && transactions.length > 0 ? (
                transactions.map((t: any) => (
                  <tr key={t.id}>
                    <td>{new Date(t.date).toLocaleDateString()}</td>
                    <td>{t.comprobanteNum || "-"}</td>
                    <td>{t.partner || "-"}</td>
                    <td>${t.amount}</td>
                    <td>
                      <span
                        className={`badge ${
                          t.status === "PAGADO"
                            ? "bg-success"
                            : t.status === "PENDIENTE"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-primary">
                        <i className="bi bi-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-muted py-3">
                    No se encontraron registros
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
