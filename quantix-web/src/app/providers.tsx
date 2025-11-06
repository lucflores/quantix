import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/hooks/useAuthStore";
import { ENV } from "@/config/env";
import { api } from "@/core/api/client";

const qc = new QueryClient();

export default function AppProviders({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    const t =
      token ??
      localStorage.getItem(ENV.TOKEN_KEY || "quantix.token") ??
      undefined;

    if (t) api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
    else delete (api.defaults.headers.common as any)["Authorization"];
  }, [token]);

  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}
