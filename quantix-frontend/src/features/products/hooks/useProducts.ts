import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

const productSchema = z.object({
  id: z.string(),
  sku: z.string(),
  name: z.string(),
  description: z.string().optional(),
  unit: z.enum(["UNIT", "KG", "LT", "M"]).optional(),
  step: z.number().optional(),
  cost: z.number().optional(),
  price: z.number(),
  stock: z.number().optional(),
  minStock: z.number().optional(),
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
