import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../core/api/client"; // usa tu cliente API

interface FormData {
  partner: string;
  amount: string;
  operation: string;
  paymentMethod: string;
  comment: string;
}

export default function PartnerTransaction() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>({
    partner: "",
    amount: "",
    operation: "",
    paymentMethod: "efectivo",
    comment: "",
  });

  const [message, setMessage] = useState<string | null>(null);

  const socios = [
    "Juan Pérez",
    "María Gómez",
    "Carlos Díaz",
    "Ana López",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      await api.post("/partner-transactions", {
        partner: form.partner,
        amount: Number(form.amount),
        operation: form.operation.toUpperCase(),
        paymentMethod: form.paymentMethod,
        comment: form.comment,
        date: new Date().toISOString(),
      });

      setMessage("✅ Operación registrada correctamente");

      setForm({
        partner: "",
        amount: "",
        operation: "",
        paymentMethod: "efectivo",
        comment: "",
      });
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
      setMessage("❌ Error al registrar la operación");
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
          <h6 className="mb-0 fw-semibold">Registrar Operación con Socio</h6>
        </div>

        <form className="text-start" onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* Socio */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Socio</label>
              <select
                className="form-select"
                name="partner"
                value={form.partner}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar socio...</option>
                {socios.map((socio) => (
                  <option key={socio} value={socio}>
                    {socio}
                  </option>
                ))}
              </select>
            </div>

            {/* Monto */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Monto</label>
              <input
                type="number"
                name="amount"
                className="form-control"
                placeholder="Ej: 1500"
                value={form.amount}
                onChange={handleChange}
                required
              />
            </div>

            {/* Operación */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Operación</label>
              <select
                className="form-select"
                name="operation"
                value={form.operation}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="cobrando">Cobrando</option>
                <option value="pagando">Pagando</option>
              </select>
            </div>

            {/* Medio de pago */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Medio de pago</label>
              <select
                className="form-select"
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                disabled // solo efectivo por ahora
              >
                <option value="efectivo">Efectivo</option>
              </select>
            </div>

            {/* Comentario */}
            <div className="col-12">
              <label className="form-label fw-semibold">Comentario</label>
              <textarea
                name="comment"
                className="form-control"
                rows={3}
                placeholder="Opcional: Detalle o referencia de la operación..."
                value={form.comment}
                onChange={handleChange}
              />
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
