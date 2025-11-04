import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "../features/auth/pages/LoginPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import { PrivateRoute } from "./PrivateRoute";
import { MovementsPage } from "../features/movements/pages/MovementsPage";
import Products from "../features/products/Pages/Products";
import Stock from "../features/movements/pages/Stock";
import StockMov from "../features/movements/pages/StockMov";
import NewProduct from "../features/products/Components/NewProduct";
import TransactionRegister from "../features/TransactionRegister/Pages/TransactionRegister";
import NewTransaction from "../features/TransactionRegister/Pages/NewTransaction";
import PartnersList from "../features/partners/pages/PartnersList";
import CuentaCte from "../features/partners/pages/CuentaCte";
import NewBalance from "../features/partners/pages/NewBalance";

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
      { path: "transactionregister", element: <TransactionRegister /> },
      { path: "transactionregister/new", element: <NewTransaction /> },
      { path: "products", element: <Products /> },
      { path: "products/new", element: <NewProduct /> },
      { path: "stock", element: <Stock /> },
      { path: "movements", element: <StockMov /> },
      { path: "partners", element: <PartnersList /> },
      { path: "partners/cuenta", element: <CuentaCte /> },
      { path: "partners/cuenta/new", element: <NewBalance /> },
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
