import axios from "axios";
import { ENV } from "@/config/env";

const TOKEN_KEY = ENV.TOKEN_KEY || "quantix.token";

// Lee token guardado como string **o** dentro del persist de Zustand
function readTokenFromStorage(): string | undefined {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return undefined;
    // si era JSON de persist (p.ej. {"state":{ token: "..." }})
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.state?.token) return String(parsed.state.token);
    } catch {
      // si era un string plano (solo el token)
      return raw || undefined;
    }
  } catch {
    return undefined;
  }
}

export const api = axios.create({
  baseURL: ENV.API_URL,
});

// ✅ Seteamos Authorization sincrónicamente apenas carga el módulo
if (typeof window !== "undefined") {
  const tk = readTokenFromStorage();
  if (tk) api.defaults.headers.common.Authorization = `Bearer ${tk}`;
}

// Por si el token cambia durante la sesión:
export const setAuthToken = (token?: string) => {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
};

// Interceptor como fallback (sigue estando bien)
api.interceptors.request.use((config) => {
  if (!config.headers?.Authorization) {
    const tk = readTokenFromStorage();
    if (tk) config.headers.Authorization = `Bearer ${tk}`;
  }
  return config;
});
