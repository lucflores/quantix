import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { DashboardPage } from "./layout/DashboardPage";
import { PrivateRoute } from "./PrivateRoute";
import { MovementsPage } from "../features/movements/pages/MovementsPage";

export const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/movements",
    element: (
      <PrivateRoute>
        <MovementsPage />
      </PrivateRoute>
    ),
  },
]);
