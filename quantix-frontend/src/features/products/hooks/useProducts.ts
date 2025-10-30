import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

const productSchema = z.object({
  id: z.string(),
  sku: z.string(),
  name: z.string(),
  unit: z.enum(["UNIT", "KG", "LT", "M"]),
  step: z.number(),
  cost: z.number(),
  price: z.number(),
  stock: z.number(),
  minStock: z.number(),
  active: z.boolean(),
});
const listSchema = z.array(productSchema);

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      // ✅ Leer token del almacenamiento correcto (Zustand persist)
      const stored = localStorage.getItem("quantix-auth");
      const token = stored ? JSON.parse(stored)?.state?.token : null;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.status === 401) throw new Error("No autorizado. Iniciá sesión.");
      if (!res.ok) throw new Error("Error al cargar productos");

      const json = await res.json();
      const data = Array.isArray(json) ? json : json.items;
      return listSchema.parse(data);
    },
  });
}
