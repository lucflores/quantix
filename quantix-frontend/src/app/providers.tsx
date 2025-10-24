import { ReactNode, useEffect, useState } from "react";
import { setAuthToken } from "../core/api/client";
import { useAuthStore } from "../features/auth/hooks/useAuthStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const Providers = ({ children }: { children: ReactNode }) => {
  const token = useAuthStore((s) => s.token);
  // Instanciamos QueryClient una sola vez
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  useEffect(() => {
    setAuthToken(token ?? undefined);
  }, [token]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
