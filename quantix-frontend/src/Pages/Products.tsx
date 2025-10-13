import { Link } from "react-router-dom";
import "./Products.css";

export default function Products() {
  return (
    <div className="container-fluid pt-4 px-4">
      <div className="bg-light text-center rounded p-4">
        {/* Encabezado con botón */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h6 className="mb-0">Productos</h6>

          {/* Botón que lleva a /newproduct */}
          <Link to="/newproduct" className="btn btn-sm btn-primary">
            Nuevo Producto
          </Link>
        </div>

        {/* Tabla de productos */}
        <div className="table-responsive">
          <table className="table text-start align-middle table-bordered table-hover mb-0">
            <thead>
              <tr className="text-dark">
                <th scope="col" style={{ width: "80px" }}>ID</th>
                <th scope="col">Nombre</th>
                <th scope="col">Descripción</th>
                <th scope="col" style={{ width: "120px" }}>Precio</th>
                <th scope="col" style={{ width: "120px" }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>001</td>
                <td>Producto A</td>
                <td>Descripción corta del producto A</td>
                <td>$10</td>
                <td>
                  <button className="btn btn-sm btn-primary">Detalle</button>
                </td>
              </tr>
              <tr>
                <td>002</td>
                <td>Producto B</td>
                <td>Descripción breve sobre el producto B</td>
                <td>$20</td>
                <td>
                  <button className="btn btn-sm btn-primary">Detalle</button>
                </td>
              </tr>
              <tr>
                <td>003</td>
                <td>Producto C</td>
                <td>Texto breve que explica el producto C</td>
                <td>$30</td>
                <td>
                  <button className="btn btn-sm btn-primary">Detalle</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
