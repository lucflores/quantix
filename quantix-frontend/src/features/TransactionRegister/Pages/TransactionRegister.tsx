import { Link } from "react-router-dom";
import "./TransactionRegister.css";

export default function TransactionRegister() {
  return (
    <div className="transaction-register-container container-fluid pt-4 px-4">
      <div className="transaction-register-card bg-light text-center rounded p-4">
        <div className="transaction-register-header d-flex align-items-center justify-content-between mb-4">
          <h6 className="mb-0">Registros</h6>
          <Link to="new" className="btn btn-sm btn-primary">
            Nuevo Registro
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table text-start align-middle table-bordered table-hover mb-0">
            <thead>
              <tr className="text-dark">
                <th scope="col">Fecha</th>
                <th scope="col">Comprobante</th>
                <th scope="col">Cliente</th>
                <th scope="col">Monto</th>
                <th scope="col">Estado</th>
                <th scope="col">Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>01 Jan 2045</td>
                <td>INV-0123</td>
                <td>Jhon Doe</td>
                <td>$123</td>
                <td>Pagado</td>
                <td>
                  <a className="btn btn-sm btn-primary" href="#">
                    Detalle
                  </a>
                </td>
              </tr>
              <tr>
                <td>01 Jan 2045</td>
                <td>INV-0123</td>
                <td>Jhon Doe</td>
                <td>$123</td>
                <td>Pagado</td>
                <td>
                  <a className="btn btn-sm btn-primary" href="#">
                    Detalle
                  </a>
                </td>
              </tr>
              <tr>
                <td>01 Jan 2045</td>
                <td>INV-0123</td>
                <td>Jhon Doe</td>
                <td>$123</td>
                <td>Pagado</td>
                <td>
                  <a className="btn btn-sm btn-primary" href="#">
                    Detalle
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
