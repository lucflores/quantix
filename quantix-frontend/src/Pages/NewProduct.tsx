import { useState } from "react";

export default function NewProduct() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Producto creado:", formData);
    alert("✅ Producto guardado correctamente");
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
            <label className="form-label small fw-semibold">Unidad de control</label>
            <select
              name="unidad"
              value={formData.unidad}
              onChange={handleChange}
              className="form-select form-select-sm"
              required
            >
              <option value="">Seleccionar...</option>
              <option value="pieza">Pieza</option>
              <option value="metro">Metro</option>
              <option value="kg">Kg</option>
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

          {/* Botón */}
          <div className="text-end">
            <button type="submit" className="btn btn-sm btn-primary px-3">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
