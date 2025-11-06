import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from "./PrivateRoute";
import { DashboardLayout } from './layout/DashboardLayout';
import LoginPage from '@/features/auth/LoginPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { ProductsPage } from '@/features/products/ProductsPage';
import { MovementsPage } from '@/features/movements/MovementsPage';
import { PurchasesPage } from '@/features/purchases/PurchasesPage';
import { SalesPage } from '@/features/sales/SalesPage';
import { CustomersPage } from '@/features/customers/CustomersPage';
import { LowStockReport } from '@/features/reports/LowStockReport';
import NotFound from '@/pages/NotFound';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="movements" element={<MovementsPage />} />
        <Route path="purchases" element={<PurchasesPage />} />
        <Route path="sales" element={<SalesPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="reports/low-stock" element={<LowStockReport />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
