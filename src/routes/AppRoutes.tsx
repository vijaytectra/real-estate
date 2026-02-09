import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy loaded pages
const HomePage = lazy(() => import("@/features/properties/HomePage"));
const PropertyDetailPage = lazy(() => import("@/features/properties/PropertyDetailPage"));
const ComparePage = lazy(() => import("@/features/properties/ComparePage"));
const LoginPage = lazy(() => import("@/features/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/features/auth/RegisterPage"));
const BuyerDashboard = lazy(() => import("@/features/buyer/BuyerDashboard"));
const SellerDashboard = lazy(() => import("@/features/seller/SellerDashboard"));
const AdminPanel = lazy(() => import("@/features/admin/AdminPanel"));
const PrivacyPolicy = lazy(() => import("@/features/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/features/pages/TermsOfService"));
const SSLSecured = lazy(() => import("@/features/pages/SSLSecured"));
const NotFoundPage = lazy(() => import("@/features/pages/NotFoundPage"));

function PageLoader() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 space-y-6">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-6 w-96" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[16/10] w-full rounded-xl" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<Layout />}>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/buyer/dashboard"
            element={
              <ProtectedRoute allowedRoles={["buyer"]}>
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/dashboard"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          {/* Static Pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/ssl-secured" element={<SSLSecured />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
