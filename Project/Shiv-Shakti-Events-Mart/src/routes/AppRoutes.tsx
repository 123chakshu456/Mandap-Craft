import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/home/HomePage';
import { AdminRoute, LoginPage } from '../features/auth';
import { SuspenseLoader } from '../shared/components/SuspenseLoader/SuspenseLoader';

// ── Lazy-Loaded Admin Cockpit Modules (Drastically reduces initial customer bundle) ──
const AdminLayout = lazy(() => import('../features/admin/layouts/AdminLayout'));
const DashboardOverviewPage = lazy(() => import('../features/admin/pages/DashboardOverviewPage'));
const ProductListPage = lazy(() => import('../features/admin/pages/ProductListPage'));
const ProductEditorPage = lazy(() => import('../features/admin/pages/ProductEditorPage'));
const CategoryManagerPage = lazy(() => import('../features/admin/pages/CategoryManagerPage'));
const FilterManagerPage = lazy(() => import('../features/admin/pages/FilterManagerPage'));
const BadgeManagerPage = lazy(() => import('../features/admin/pages/BadgeManagerPage'));
const PageCmsPage = lazy(() => import('../features/admin/pages/PageCmsPage'));
const MediaLibraryPage = lazy(() => import('../features/admin/pages/MediaLibraryPage'));
const OrderManagerPage = lazy(() => import('../features/admin/pages/OrderManagerPage'));
const QuoteManagerPage = lazy(() => import('../features/admin/pages/QuoteManagerPage'));
const BackupRestorePage = lazy(() => import('../features/admin/pages/BackupRestorePage'));
const CarouselSlideManagerPage = lazy(() => import('../features/admin/pages/CarouselSlideManagerPage'));

// ── Lazy-Loaded Storefront Secondary Routes ──
const CheckoutPage = lazy(() => import('../features/orders/pages/CheckoutPage'));
const DynamicPageView = lazy(() => import('../features/pages-cms/pages/DynamicPageView'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<SuspenseLoader />}>
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
          <Route path="carousel" element={<CarouselSlideManagerPage />} />
          <Route path="media" element={<MediaLibraryPage />} />
          <Route path="orders" element={<OrderManagerPage />} />
          <Route path="quotes" element={<QuoteManagerPage />} />
          <Route path="backup" element={<BackupRestorePage />} />
        </Route>

        {/* ── PUBLIC STOREFRONT & DYNAMIC CMS ── */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="catalog" element={<Navigate to="/" replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="page/:slug" element={<DynamicPageView />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
