import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { DashboardPage } from "./layout/DashboardPage";
import { PrivateRoute } from "./PrivateRoute";

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
]);
