import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../core/api/client";

export default function StockMovement() {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState("Ningún archivo seleccionado");
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    type: "",
    date: "",
    product: "",
    quantity: "",
    partner: "",
    comprobanteNum: "",
  });
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      let comprobanteUrl = "";
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        comprobanteUrl = data.url;
      }

      await api.post("transactions", {
        type: form.type.toUpperCase(),
        comprobanteUrl,
        comprobanteNum: form.comprobanteNum,
        partner: form.partner,
        amount: Number(form.quantity),
        date: new Date(form.date || new Date()).toISOString(),
        status: "PAGADO",
      });

      setMessage("✅ Movimiento registrado correctamente");
      setForm({
        type: "",
        date: "",
        product: "",
        quantity: "",
        partner: "",
        comprobanteNum: "",
      });
      setFile(null);
      setFileName("Ningún archivo seleccionado");
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
      setMessage("❌ Error al registrar el movimiento");
    }
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
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h6 className="mb-0 fw-semibold">Registrar Movimiento</h6>
        </div>

        <form className="text-start" onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* Tipo de movimiento */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Tipo</label>
              <select
                className="form-select"
                name="type"
                value={form.type}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="ingreso">Ingreso</option>
                <option value="egreso">Egreso</option>
              </select>
            </div>

            {/* Fecha */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Fecha</label>
              <input
                type="date"
                name="date"
                className="form-control"
                value={form.date}
                onChange={handleChange}
              />
            </div>

            {/* Producto */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Producto</label>
              <input
                type="text"
                name="product"
                className="form-control"
                placeholder="Ej: Producto A"
                value={form.product}
                onChange={handleChange}
              />
            </div>

            {/* Cantidad */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Cantidad</label>
              <input
                type="number"
                name="quantity"
                className="form-control"
                min="1"
                placeholder="Ej: 10"
                value={form.quantity}
                onChange={handleChange}
              />
            </div>

            {/* Proveedor */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Socio</label>
              <input
                type="text"
                name="partner"
                className="form-control"
                placeholder="Ej: Distribuidora ABC"
                value={form.partner}
                onChange={handleChange}
              />
            </div>

            {/* Nº de remito */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Nº de Remito</label>
              <input
                type="text"
                name="comprobanteNum"
                className="form-control"
                placeholder="Ej: 0012-00012345"
                value={form.comprobanteNum}
                onChange={handleChange}
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

          {/* Botones */}
          <div className="d-flex justify-content-between mt-4">
            <button
              type="button"
              className="btn btn-primary btn-sm px-4"
              style={{
                backgroundColor: "#0d6efd",
                borderColor: "#0d6efd",
              }}
              onClick={() => navigate(-1)}
            >
              Volver
            </button>

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

        {message && <p className="mt-3 text-center">{message}</p>}
      </div>
    </div>
  );
}
