import type { Movement } from "../types";

function formatQty(q: string | number) {
  const n = typeof q === "string" ? Number(q) : q;
  return isNaN(n) ? q : n.toLocaleString("es-AR");
}

function KindBadge({ kind }: { kind: "IN" | "OUT" }) {
  const cls = kind === "IN" ? "bg-success" : "bg-danger";
  const label = kind === "IN" ? "IN" : "OUT";
  return <span className={`badge ${cls}`}>{label}</span>;
}

export const MovementsTable = ({ rows }: { rows: Movement[] }) => {
  return (
    <div className="table-responsive">
      <table className="table table-sm align-middle">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Producto</th>
            <th>Cant.</th>
            <th>SKU</th>
            <th>Creado por</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((m) => (
            <tr key={m.id}>
              <td>
                {new Date(m.createdAt).toLocaleString("es-AR", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </td>
              <td>
                <KindBadge kind={m.kind} />
              </td>
              <td>{m.product?.name ?? m.productId}</td>
              <td>{formatQty(m.quantity)}</td>
              <td>{m.product?.sku ?? "-"}</td>
              <td>{m.createdById ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
