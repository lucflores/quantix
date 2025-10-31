import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    color: "",
    ancho: "",
    composicion: "",
    unidad: "",
    stockMinimo: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const stored = localStorage.getItem("quantix-auth");
      const token = stored ? JSON.parse(stored)?.state?.token : null;

      if (!token) {
        alert("⚠️ No se encontró token, iniciá sesión nuevamente.");
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sku: formData.codigo,
          name: formData.nombre,
          description: formData.composicion || "",
          unit: formData.unidad.toUpperCase(),
          step: 1,
          cost: 0,
          price: 0,
          stock: 0,
          minStock: Number(formData.stockMinimo || 0),
          active: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || data.message || "Error al crear producto");
      }

      // ✅ Producto creado correctamente
      navigate(-1);
    } catch (err: any) {
      console.error("❌ Error al crear producto:", err);
      alert(`❌ ${err.message}`);
    }
  };

  return (
    <div className="container py-3" style={{ maxWidth: "500px" }}>
      <div className="bg-white p-3 rounded border">
        <h5 className="text-center text-primary mb-3">
          Cargar / Actualizar Producto
        </h5>

        <form onSubmit={handleSubmit}>
          {/* Código */}
          <div className="mb-2">
            <label className="form-label small fw-semibold">Código</label>
            <input
              type="text"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              className="form-control form-control-sm"
              required
            />
          </div>

          {/* Nombre */}
          <div className="mb-2">
            <label className="form-label small fw-semibold">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="form-control form-control-sm"
              required
            />
          </div>

          {/* Color */}
          <div className="mb-2">
            <label className="form-label small fw-semibold">Color</label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="form-control form-control-sm"
            />
          </div>

          {/* Ancho */}
          <div className="mb-2">
            <label className="form-label small fw-semibold">Ancho</label>
            <input
              type="text"
              name="ancho"
              value={formData.ancho}
              onChange={handleChange}
              className="form-control form-control-sm"
            />
          </div>

          {/* Composición */}
          <div className="mb-2">
            <label className="form-label small fw-semibold">Composición</label>
            <input
              type="text"
              name="composicion"
              value={formData.composicion}
              onChange={handleChange}
              className="form-control form-control-sm"
            />
          </div>

          {/* Unidad */}
          <div className="mb-2">
            <label className="form-label small fw-semibold">
              Unidad de control
            </label>
            <select
              name="unidad"
              value={formData.unidad}
              onChange={handleChange}
              className="form-select form-select-sm"
              required
            >
              <option value="">Seleccionar...</option>
              <option value="UNIT">Unidad</option>
              <option value="KG">Kilogramo</option>
              <option value="LT">Litro</option>
              <option value="M">Metro</option>
            </select>
          </div>

          {/* Stock mínimo */}
          <div className="mb-3">
            <label className="form-label small fw-semibold">Stock mínimo</label>
            <input
              type="number"
              name="stockMinimo"
              value={formData.stockMinimo}
              onChange={handleChange}
              className="form-control form-control-sm"
              min="0"
            />
          </div>

          {/* Botones */}
          <div className="d-flex justify-content-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-sm btn-primary px-3"
            >
              Volver
            </button>
            <button type="submit" className="btn btn-sm btn-primary px-3">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
