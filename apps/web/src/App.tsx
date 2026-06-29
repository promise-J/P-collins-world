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
import ProfilePage from "./pages/profile/ProfilePage";
import { ProtectedRoute } from "./ui/guards/ProtectedRoute";
import HomePage from "./pages/home/HomePage";
import CheckEmailPage from "./pages/auth/CheckEmailPage";
import { LoadingScreen } from "./ui/feedback/LoadingScreen";
import CreatePropertyPage from "./pages/properties/CreateProperty";
import ComparePropertiesPage from "./pages/properties/ComparePropertyPage";
import CreateProductPage from "./pages/products/CreateProductPage";
import PlanDetailsPage from "./pages/savings/PlanDetailsPage";
import GroupDetailsPage from "./pages/savings/GroupDetailsPage";
import NotificationPage from "./pages/notifications/NotificationPage";
import SettingsPage from "./pages/settings/SettingsPage";
import AgentProperties from "./pages/agents/AgentPropertiesPage";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminKyc from "./pages/admin/AdminKyc";
import { RoleGuard } from "./ui";
import { AddProperty } from "./pages/dashboard/AddProperty";
import LandlordProperties from "./pages/landlords/LandLordPropertiesPage";
import KYCSubmissionPage from "./pages/kyc/KYCSubmission";
import AdminLoginPage from "./pages/auth/AdminLoginPage";
import AdminAuditLog from "./pages/admin/AdminAuditLog";
import AdminDisputes from "./pages/admin/AdminDispute";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminProducts from "./pages/admin/AdminProducts";
import AgentInquiries from "./pages/agents/AgentInquiries";
import AgentAppointments from "./pages/agents/AgentAppointments";
import AgentClients from "./pages/agents/AgentClients";
import AgentAnalytics from "./pages/agents/AgentAnalytics";
import AgentCommission from "./pages/agents/AgentCommission";
import LandlordAnalytics from "./pages/landlords/LandlordAnalytics";
import LandlordDocuments from "./pages/landlords/LandlordDocuments";
import LandlordMaintenance from "./pages/landlords/LandlordMaintenance";
import LandlordRentPayments from "./pages/landlords/LandlordRentPayments";
import LandlordTenants from "./pages/landlords/LandlordTenants";
import RoleSelectionPage from "./pages/auth/RoleSelectionPage";
import { ScrollToTop } from "./components/utils/ScrollToTop";
import GroupSavingsPage from "./pages/savings/GroupSavingsPage";
import WishlistPage from "./pages/products/WishlistPage";
import CategoriesPage from "./pages/categories/CategoriesPage";
import AdminCategories from "./pages/categories/AdminCategories";
import PaymentVerificationPage from "./pages/payment/PaymentVerificationPage";
import AdminLocations from "./pages/admin/AdminLocations";
import FundWalletPage from "./pages/wallet/FundWalletPage";
import WalletPage from "./pages/wallet/WalletPage";
import OrdersPage from "./pages/products/OrdersPage";
import OrderDetailsPage from "./pages/products/OrderDetailsPage";
import AdminOrders from "./pages/admin/AdminOrdersPage";
import AdminOrderDetails from "./pages/admin/AdminOrderDetailsPage";
import AdminPropertyEdit from "./pages/admin/AdminPropertyEdit";
import AdminProductEdit from "./pages/admin/AdminProductEdit";
import FavoritesPage from "./pages/properties/FavoritesPage";

function App() {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Show loading spinner while checking auth state
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes - No Auth Required */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/role-selection" element={<RoleSelectionPage />} />
          <Route path="/role-selection/:mode" element={<RoleSelectionPage />} />
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
            path="/admin/login"
            element={
              !isAuthenticated ? (
                <AdminLoginPage />
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
          <Route path="/categories" element={<CategoriesPage />} />

          {/* properties */}
          <Route path="/properties" element={<PropertiesPage />} />
          <Route
            path="/properties/compare"
            element={<ComparePropertiesPage />}
          />
          <Route path="/properties/:id" element={<PropertyDetailsPage />} />
          <Route path="/properties/favorites" element={<FavoritesPage />} />
          <Route path="/payment/verify" element={<PaymentVerificationPage />} />
        </Route>

        {/* Protected Routes - User Auth Required */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/dashboard"
              element={
                <RoleGuard
                  allowedRoles={[
                    "USER",
                    "LANDLORD",
                    "AGENT",
                    "ADMIN",
                    "SUPER_ADMIN",
                  ]}
                >
                  <DashboardHomePage />
                </RoleGuard>
              }
            />
            <Route
              path="/products/create"
              element={
                <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                  <CreateProductPage />
                </RoleGuard>
              }
            />
            <Route path="/kyc/submit" element={<KYCSubmissionPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailsPage />} />
            <Route path="/wallet/fund" element={<FundWalletPage />} />
            <Route
              path="/properties/create"
              element={
                <RoleGuard
                  allowedRoles={["ADMIN", "SUPER_ADMIN", "AGENT", "LANDLORD"]}
                >
                  <CreatePropertyPage />
                </RoleGuard>
              }
            />

            {/* Agent routes */}
            <Route
              path="/agent/properties"
              element={
                <RoleGuard allowedRoles={["AGENT"]}>
                  <AgentProperties />
                </RoleGuard>
              }
            />
            <Route
              path="/agent/properties/create"
              element={
                <RoleGuard allowedRoles={["AGENT"]}>
                  <AddProperty
                    userRole="AGENT"
                    redirectPath="/agent/properties"
                  />
                </RoleGuard>
              }
            />
            <Route
              path="/agent/inquiries"
              element={
                <RoleGuard allowedRoles={["AGENT"]}>
                  <AgentInquiries />
                </RoleGuard>
              }
            />
            <Route
              path="/agent/appointments"
              element={
                <RoleGuard allowedRoles={["AGENT"]}>
                  <AgentAppointments />
                </RoleGuard>
              }
            />
            <Route
              path="/agent/clients"
              element={
                <RoleGuard allowedRoles={["AGENT"]}>
                  <AgentClients />
                </RoleGuard>
              }
            />
            <Route
              path="/agent/analytics"
              element={
                <RoleGuard allowedRoles={["AGENT"]}>
                  <AgentAnalytics />
                </RoleGuard>
              }
            />
            <Route
              path="/agent/commission"
              element={
                <RoleGuard allowedRoles={["AGENT"]}>
                  <AgentCommission />
                </RoleGuard>
              }
            />
            <Route
              path="/agent/properties/create"
              element={
                <RoleGuard allowedRoles={["AGENT"]}>
                  <AddProperty
                    userRole="AGENT"
                    redirectPath="/agent/properties"
                  />
                </RoleGuard>
              }
            />

            {/* Landlord routes */}
            <Route
              path="/landlord/properties"
              element={
                <RoleGuard allowedRoles={["LANDLORD"]}>
                  <LandlordProperties />
                </RoleGuard>
              }
            />
            <Route
              path="/landlord/properties/create"
              element={
                <RoleGuard allowedRoles={["LANDLORD"]}>
                  <AddProperty
                    userRole="LANDLORD"
                    redirectPath="/landlord/properties"
                  />
                </RoleGuard>
              }
            />
            <Route
              path="/landlord/tenants"
              element={
                <RoleGuard allowedRoles={["LANDLORD"]}>
                  <LandlordTenants />
                </RoleGuard>
              }
            />
            <Route
              path="/landlord/rentals"
              element={
                <RoleGuard allowedRoles={["LANDLORD"]}>
                  <LandlordRentPayments />
                </RoleGuard>
              }
            />
            <Route
              path="/landlord/maintenance"
              element={
                <RoleGuard allowedRoles={["LANDLORD"]}>
                  <LandlordMaintenance />
                </RoleGuard>
              }
            />
            <Route
              path="/landlord/documents"
              element={
                <RoleGuard allowedRoles={["LANDLORD"]}>
                  <LandlordDocuments />
                </RoleGuard>
              }
            />
            <Route
              path="/landlord/analytics"
              element={
                <RoleGuard allowedRoles={["LANDLORD"]}>
                  <LandlordAnalytics />
                </RoleGuard>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin/users"
              element={
                <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                  <AdminUsers />
                </RoleGuard>
              }
            />

            <Route
              path="/admin/categories"
              element={
                <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                  <AdminCategories />
                </RoleGuard>
              }
            />

            <Route
              path="/admin/products"
              element={
                <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                  <AdminProducts />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/products/create"
              element={
                <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                  <CreateProductPage />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/products/:id/edit"
              element={
                <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                  <AdminProductEdit />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/properties"
              element={
                <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                  <AdminProperties />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/properties/create"
              element={
                <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                  <AddProperty
                    userRole="ADMIN | SUPER_ADMIN"
                    redirectPath="/admin/properties"
                  />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/properties/:id/edit"
              element={
                <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                  <AdminPropertyEdit />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/transactions"
              element={
                <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                  <AdminTransactions />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                  <AdminAnalytics />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/disputes"
              element={
                <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                  <AdminDisputes />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/audit"
              element={
                <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                  <AdminAuditLog />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/kyc"
              element={
                <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                  <AdminKyc />
                </RoleGuard>
              }
            />

            <Route
              path="/admin/locations"
              element={
                <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                  <AdminLocations />
                </RoleGuard>
              }
            />

            <Route
              path="/admin/orders"
              element={
                <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                  <AdminOrders />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/orders/:id"
              element={
                <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                  <AdminOrderDetails />
                </RoleGuard>
              }
            />
            {/* Admin ends */}

            <Route
              path="/savings"
              element={
                <RoleGuard allowedRoles={["USER"]}>
                  <SavingsGoalPage />
                </RoleGuard>
              }
            />
            <Route
              path="/savings/groups"
              element={
                <RoleGuard allowedRoles={["USER"]}>
                  <GroupSavingsPage />
                </RoleGuard>
              }
            />
            <Route
              path="/savings/groups/:id"
              element={
                <RoleGuard allowedRoles={["USER"]}>
                  <GroupDetailsPage />
                </RoleGuard>
              }
            />
            <Route
              path="/savings/plan/:id"
              element={
                <RoleGuard allowedRoles={["USER"]}>
                  <PlanDetailsPage />
                </RoleGuard>
              }
            />
            <Route
              path="/savings/groups/:id"
              element={
                <RoleGuard allowedRoles={["USER"]}>
                  <PlanDetailsPage />
                </RoleGuard>
              }
            />

            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
