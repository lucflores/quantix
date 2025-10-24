import { useState } from "react";
import { useAuthStore } from "./useAuthStore";
import { login as loginApi } from "../api/auth";

export const useLogin = () => {
  const setToken = useAuthStore((s) => s.setToken);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { token } = await loginApi({ email, password });
      setToken(token); // Zustand persist
      return true;
    } catch (e: any) {
      const msg = e?.response?.data?.error ?? "Credenciales inválidas";
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
