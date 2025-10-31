import { useState } from "react";

export default function StockMovement() {
  const [fileName, setFileName] = useState("Ningún archivo seleccionado");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) setFileName(file.name);
  };

  return (
    <div className="container-fluid pt-4 px-4">
      <div
        className="bg-light rounded p-4 shadow-sm"
        style={{
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h6 className="mb-0 fw-semibold">Registrar Movimiento</h6>
        </div>

        {/* Formulario compacto */}
        <form className="text-start">
          <div className="row g-3">
            {/* Tipo de movimiento */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Tipo</label>
              <select className="form-select">
                <option value="">Seleccionar...</option>
                <option value="ingreso">Ingreso</option>
                <option value="egreso">Egreso</option>
              </select>
            </div>

            {/* Fecha */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Fecha</label>
              <input type="date" className="form-control" />
            </div>

            {/* Producto */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Producto</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej: Producto A"
              />
            </div>

            {/* Cantidad */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Cantidad</label>
              <input
                type="number"
                className="form-control"
                min="1"
                placeholder="Ej: 10"
              />
            </div>

            {/* Proveedor */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Proveedor</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej: Distribuidora ABC"
              />
            </div>

            {/* Nº de remito */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Nº de Remito</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej: 0012-00012345"
              />
            </div>

            {/* Adjuntar archivo */}
            <div className="col-12">
              <label className="form-label fw-semibold">Adjuntar Remito</label>
              <div
                className="border border-2 border-secondary rounded py-3 text-center"
                style={{
                  cursor: "pointer",
                  backgroundColor: "#fdfdfd",
                  transition: "all 0.3s ease",
                }}
                onClick={() => {
                  const fileInput = document.getElementById("fileInput");
                  if (fileInput) fileInput.click();
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f1faff")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#fdfdfd")
                }
              >
                <i className="bi bi-cloud-upload fs-4 text-primary"></i>
                <p className="mb-1 small">
                  Arrastra o haz clic para subir el remito escaneado
                </p>
                <small className="text-muted">{fileName}</small>
                <input
                  id="fileInput"
                  type="file"
                  className="d-none"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>

          {/* Botón */}
          <div className="text-end mt-4">
            <button
              type="submit"
              className="btn btn-primary btn-sm px-4"
              style={{
                backgroundColor: "#0d6efd",
                borderColor: "#0d6efd",
              }}
            >
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
