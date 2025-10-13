import { Outlet, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Layout.css";

export default function Layout() {
  return (
    <div className="app-container bg-white d-flex">
      {/* ===== Sidebar Start ===== */}
      <div className="sidebar d-flex flex-column flex-shrink-0 p-3 bg-light border-end">
        <Link
          to="/home"
          className="d-flex align-items-center mb-3 mb-md-4 me-md-auto text-primary text-decoration-none"
        >
          <span className="fs-4 fw-bold">Quantix</span>
        </Link>

        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <Link to="/home" className="nav-link text-dark">
              <i className="bi bi-house-door me-2"></i> Registros
            </Link>
          </li>

          <li>
            <Link to="/products" className="nav-link text-dark">
              <i className="bi bi-box-seam me-2"></i> Productos
            </Link>
          </li>

          {/* ===== Dropdown Stock ===== */}
          <li className="nav-item dropdown">
            <a
              href="#"
              className="nav-link dropdown-toggle text-dark"
              id="stockDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-archive me-2"></i> Stock
            </a>
            <ul
              className="dropdown-menu border-0 shadow-sm"
              aria-labelledby="stockDropdown"
            >
              <li>
                <Link className="dropdown-item" to="/stock">
                  Control de stock
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/stock/movimientos">
                  Movimientos
                </Link>
              </li>
            </ul>
          </li>

          <li>
            <Link to="/example" className="nav-link text-dark">
              <i className="bi bi-gear me-2"></i> Example
            </Link>
          </li>
        </ul>
      </div>
      {/* ===== Sidebar End ===== */}

      {/* ===== Content Start ===== */}
      <div className="content flex-grow-1 d-flex flex-column">
        {/* Header con perfil */}
        <nav className="profile-navbar d-flex justify-content-end align-items-center bg-white px-4 py-1">
          <div className="dropdown">
            <button
              className="btn dropdown-toggle d-flex align-items-center"
              type="button"
              id="userMenu"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="https://i.pravatar.cc/40"
                alt="User"
                className="rounded-circle me-2"
                width="40"
                height="40"
              />
              <span className="fw-semibold text-dark">Admin</span>
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end shadow border-0"
              aria-labelledby="userMenu"
            >
              <li>
                <button className="dropdown-item">My Profile</button>
              </li>
              <li>
                <button className="dropdown-item">Settings</button>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button className="dropdown-item text-danger">Log Out</button>
              </li>
            </ul>
          </div>
        </nav>

        {/* Contenido dinámico */}
        <div className="p-4 flex-grow-1">
          <Outlet />
        </div>

        {/* Footer */}
        <footer className="layout-footer text-center py-3 border-top bg-light mt-auto">
          <p className="mb-0">
            &copy; <Link to="/">Quantix</Link> — Todos los derechos reservados.
          </p>
        </footer>
      </div>
      {/* ===== Content End ===== */}
    </div>
  );
}
