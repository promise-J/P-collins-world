import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/auth.store";
import { PublicLayout } from "./ui/layouts/PublicLayout";
import { DashboardLayout } from "./ui/layouts/DashboardLayout";

// Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import DashboardHomePage from "./pages/dashboard/DashboardHomePage";
import ProductsPage from "./pages/products/ProductsPage";
import ProductDetailsPage from "./pages/products/ProductDetailsPage";
import CartPage from "./pages/products/CartPage";
import CheckoutPage from "./pages/products/CheckoutPage";
import PropertiesPage from "./pages/properties/PropertiesPage";
import PropertyDetailsPage from "./pages/properties/PropertyDetailsPage";
import SavingsGoalPage from "./pages/savings/SavingsGoalPage";
import WalletPage from "./pages/savings/WalletPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { ProtectedRoute } from "./ui/guards/ProtectedRoute";
import HomePage from "./pages/home/HomePage";
import CheckEmailPage from "./pages/auth/CheckEmailPage";
import { LoadingScreen } from "./ui/feedback/LoadingScreen";
import CreatePropertyPage from "./pages/properties/CreateProperty";
import ComparePropertiesPage from "./pages/properties/ComparePropertyPage";
import CreateProductPage from "./pages/properties/CreateProductPage";

function App() {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Show loading spinner while checking auth state
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - No Auth Required */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <LoginPage />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/register"
            element={
              !isAuthenticated ? (
                <RegisterPage />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/check-email" element={<CheckEmailPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
          <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/products/create" element={<CreateProductPage />} />

          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/properties/create" element={<CreatePropertyPage />} />
          <Route path="/properties/compare" element={<ComparePropertiesPage />} />
          <Route path="/properties/:id" element={<PropertyDetailsPage />} />
        </Route>

        {/* Protected Routes - Auth Required */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardHomePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/savings" element={<SavingsGoalPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* 404 - Redirect to products */}
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
