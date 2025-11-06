// src/features/auth/hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { postLogin } from "../api/auth";
import type { LoginDto, User } from "../types";
import { useAuthStore } from "./useAuthStore";
import { api } from "@/core/api/client";

function decodeJwt(token: string): Partial<User> {
  try {
    const [, payload] = token.split(".");
    const json = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );
    return {
      id: json.sub ?? "",
      email: json.email,
      name: json.name ?? null,
      role: json.role,
    };
  } catch {
    return {};
  }
}

export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (dto: LoginDto) => {
      const { token, user } = await postLogin(dto);

      // fijar header global para siguientes requests
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // si el back NO envía user, intento sacarlo del JWT; si ni eso, uso el email
      const me: User | undefined =
        user ??
        ((): User | undefined => {
          const fromJwt = decodeJwt(token);
          if (fromJwt.email || fromJwt.id) {
            return {
              id: fromJwt.id ?? "",
              email: fromJwt.email ?? dto.email,
              name: fromJwt.name ?? null,
              role: fromJwt.role,
            };
          }
          // fallback mínimo
          return { id: "", email: dto.email, name: null };
        })();

      setAuth(token, me);
      return { token, user: me };
    },
  });
};
