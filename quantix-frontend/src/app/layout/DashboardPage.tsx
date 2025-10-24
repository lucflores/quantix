import { Link } from "react-router-dom";

export const DashboardPage = () => (
  <div className="container py-4">
    <h3>Quantix — Dashboard</h3>
    <div className="list-group mt-3">
      <Link to="/movements" className="list-group-item list-group-item-action">
        Ver últimos movimientos
      </Link>
      {/* Agregaremos Productos, Compras, Ventas, etc. */}
    </div>
  </div>
);

