import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/home/HomePage';

// Feature-Based Modules
import { AdminRoute, LoginPage } from '../features/auth';
import { CheckoutPage } from '../features/orders';
import {
  AdminLayout,
  DashboardOverviewPage,
  ProductListPage,
  ProductEditorPage,
  CategoryManagerPage,
  FilterManagerPage,
  BadgeManagerPage,
  PageCmsPage,
  MediaLibraryPage,
  OrderManagerPage,
  QuoteManagerPage,
} from '../features/admin';
import { DynamicPageView } from '../features/pages-cms';

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── MODULAR ADMIN MANAGEMENT COCKPIT ── */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<DashboardOverviewPage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="products/new" element={<ProductEditorPage />} />
        <Route path="products/:id/edit" element={<ProductEditorPage />} />
        <Route path="categories" element={<CategoryManagerPage />} />
        <Route path="filters" element={<FilterManagerPage />} />
        <Route path="badges" element={<BadgeManagerPage />} />
        <Route path="pages" element={<PageCmsPage />} />
        <Route path="media" element={<MediaLibraryPage />} />
        <Route path="orders" element={<OrderManagerPage />} />
        <Route path="quotes" element={<QuoteManagerPage />} />
      </Route>

      {/* ── PUBLIC STOREFRONT & DYNAMIC CMS ── */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="page/:slug" element={<DynamicPageView />} />
      </Route>
    </Routes>
  );
}
