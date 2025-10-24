import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../features/auth/hooks/useAuthStore";

type Props = { children: ReactNode };

export const PrivateRoute = ({ children }: Props) => {
  const isAuthed = useAuthStore((s) => s.isAuthed());
  return isAuthed ? <>{children}</> : <Navigate to="/" replace />;
};
