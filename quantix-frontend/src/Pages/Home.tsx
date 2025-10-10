import { useState } from 'react';
import { Link } from 'react-router-dom';
import "./Home.css";

function Home() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="app-container position-relative bg-white d-flex p-0">
        {/* Sidebar Start */}
        <div className="sidebar pe-4 pb-3">
          <nav className="navbar bg-light navbar-light">
            <Link to="/" className="navbar-brand mx-4 mb-3">
              <h3 className="text-primary">
                <i className=""></i>Quantix
              </h3>
            </Link>

            <div className="navbar-nav w-100">
              <Link to="/" className="nav-item nav-link active">
                <i className="fa fa-tachometer-alt me-2"></i>Dashboard
              </Link>

              <Link to="/tables" className="nav-item nav-link">
                <i className="fa fa-table me-2"></i>Tables
              </Link>

              <Link to="/example" className="nav-item nav-link">
                <i className="fa fa-chart-bar me-2"></i>Example
              </Link>

              <div className="nav-item dropdown">
                <a
                  href="#"
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  <i className="far fa-file-alt me-2"></i>Pages
                </a>
                <div className="dropdown-menu bg-transparent border-0">
                  <Link to="/signin" className="dropdown-item">
                    Sign In
                  </Link>
                  <Link to="/signup" className="dropdown-item">
                    Sign Up
                  </Link>
                  <Link to="/404" className="dropdown-item">
                    404 Error
                  </Link>
                  <Link to="/blank" className="dropdown-item">
                    Blank Page
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </div>
        {/* Sidebar End */}

        {/* Content Start */}
        <div className="content">
          {/* Navbar Start */}
          <nav className="navbar navbar-expand bg-light navbar-light sticky-top px-4 py-0">
            <Link to="/" className="navbar-brand d-flex d-lg-none me-4">
              <h2 className="text-primary mb-0">
                <i className="fa fa-hashtag"></i>
              </h2>
            </Link>
            <a href="#" className="sidebar-toggler flex-shrink-0">
              <i className="fa fa-bars"></i>
            </a>
            <form className="d-none d-md-flex ms-4">
              <input
                className="form-control border-0"
                type="search"
                placeholder="Search"
              />
            </form>
            <div className="navbar-nav align-items-center ms-auto">
              <div className="nav-item dropdown">
                <a
                  href="#"
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  <img
                    className="rounded-circle me-lg-2"
                    src="img/user.jpg"
                    alt=""
                    style={{ width: '40px', height: '40px' }}
                  />
                  <span className="d-none d-lg-inline-flex">Lolo Flo</span>
                </a>
                <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
                  <a href="#" className="dropdown-item">
                    My Profile
                  </a>
                  <a href="#" className="dropdown-item">
                    Settings
                  </a>
                  <a href="#" className="dropdown-item">
                    Log Out
                  </a>
                </div>
              </div>
            </div>
          </nav>
          {/* Navbar End */}

          {/* Recent Sales Start */}
          <div className="container-fluid pt-4 px-4">
            <div className="bg-light text-center rounded p-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h6 className="mb-0">Recientes</h6>
                <a href="#">Mostrar Todo</a>
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
          {/* Recent Sales End */}

          {/* Footer Start */}
          <div className="container-fluid pt-4 px-4">
            <div className="bg-light rounded-top p-4">
              <div className="row">
                <div className="col-12 col-sm-6 text-center text-sm-start">
                  &copy; <Link to="/">Quantix</Link>, All Right Reserved.
                </div>
                <div className="col-12 col-sm-6 text-center text-sm-end">
                  Designed By <a href="#">Piko</a>
                </div>
              </div>
            </div>
          </div>
          {/* Footer End */}
        </div>
        {/* Content End */}

        {/* Back to Top */}
        <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top">
          <i className="bi bi-arrow-up"></i>
        </a>
      </div>
    </>
  );
}

export default Home;
