import axios from "axios";

// ⚠️ DEV: forzamos ruta relativa para usar el proxy de Vite
export const api = axios.create({ baseURL: "/api/v1" });

api.interceptors.response.use(
  (r) => r,
  (e) => { console.error("API error:", e); throw e; }
);

// opcional: si usas auth
export function setAuthToken(token?: string) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}
