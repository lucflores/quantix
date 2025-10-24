import { ReactNode, useEffect } from "react";
import { setAuthToken } from "../core/api/client";
import { useAuthStore } from "../features/auth/hooks/useAuthStore";

export const Providers = ({ children }: { children: ReactNode }) => {
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    // cada vez que cambie el token en la store, lo aplicamos al cliente Axios
    setAuthToken(token ?? undefined);
  }, [token]);

  return <>{children}</>;
};
