import { useState } from "react";
import { api } from "../../../core/api/client";
import type { LoginResponse } from "../types";
import { useAuthStore } from "./useAuthStore";

export const useLogin = () => {
  const setToken = useAuthStore((s) => s.setToken);

  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.post<LoginResponse>("/auth/login", { email, password });
      setToken(data.token);       // guarda en Zustand (persist)
      return true;
    } catch (e: any) {
      setError(e?.response?.data?.error ?? "Credenciales inválidas");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
