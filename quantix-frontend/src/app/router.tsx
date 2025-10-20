import { createBrowserRouter, Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import { useAuth } from "../core/auth/useAuth";
import ProductsList from "../features/products/pages/ProductsList";
import Login from "../features/users/pages/Login";

function PrivateRoute({ children }: { children: ReactElement }) {
  const isAuthed = useAuth((s) => s.isAuthed());
  return isAuthed ? children : <Navigate to="/login" replace />;
}

function RouteError() {
  return <div style={{padding:24}}><h3>Ups… ruta no encontrada</h3></div>;
}

export const router = createBrowserRouter([
  { path: "/login", element: <Login />, errorElement: <RouteError/> },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <ProductsList />
      </PrivateRoute>
    ),
    errorElement: <RouteError/>
  },
  // fallback opcional
  { path: "*", element: <Navigate to="/login" replace /> }
]);
