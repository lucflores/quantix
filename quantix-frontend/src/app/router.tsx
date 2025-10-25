import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "../features/auth/pages/LoginPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import { PrivateRoute } from "./PrivateRoute";
import { MovementsPage } from "../features/movements/pages/MovementsPage";
import Home from "../Pages/Home";
import Products from "../features/products/Products";
import Stock from "../Pages/Stock";
import StockMov from "../Pages/StockMov";

export const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },

  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardPage />
      </PrivateRoute>
    ),
    children: [
      {
        path: "home", 
        element: <Home />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "stock",
        element: <Stock />,
      },
      {
        path: "movements",
        element: <StockMov />,
      },
    ],
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
