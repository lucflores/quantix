import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ENV } from "@/config/env";
import { api } from "@/core/api/client";

export type User = {
  id: string;
  name: string | null;
  email: string;
  role?: "ADMIN" | "EMPLOYEE";
};

type AuthState = {
  token?: string;
  user?: User;
  setAuth: (token: string, user?: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: undefined,
      user: undefined,

      setAuth: (token, user) => {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        set({ token, user });
      },

      logout: () => {
        delete (api.defaults.headers.common as any)["Authorization"];
        set({ token: undefined, user: undefined });
      },
    }),
    { name: ENV.TOKEN_KEY || "quantix.token" }
  )
);
