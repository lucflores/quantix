import axios from "axios";
import { ENV } from "@/config/env";

// leer del localStorage (persist de zustand)
function readTokenFromStorage(): string | undefined {
  try {
    const raw = localStorage.getItem(ENV.TOKEN_KEY || "quantix.token");
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    return parsed?.state?.token ?? undefined; // 👈 token real
  } catch {
    return undefined;
  }
}

export const api = axios.create({
  baseURL: ENV.API_URL,
});

api.interceptors.request.use((config) => {
  const token = readTokenFromStorage();   
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
