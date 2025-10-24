import { useQuery } from "@tanstack/react-query";
import { fetchLastMovements } from "../api/movements";
import type { Movement, MovementsQuery } from "../types";

// Hoy el backend no recibe filtros: traemos 100 y filtramos client-side.
// Si mañana se agrega filtros en la API, se puede pasar acá y cambiar el queryFn.
export const useMovements = (_filters: MovementsQuery) => {
  return useQuery<Movement[]>({
    queryKey: ["movements", "last-100"], 
    queryFn: fetchLastMovements,
  });
};
