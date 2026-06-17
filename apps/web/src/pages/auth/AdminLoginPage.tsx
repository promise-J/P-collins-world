import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/ui/components/Button";
import { FormInput } from "@/ui/forms/FormInput";
import { Spinner } from "@/ui/feedback/Spinner";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Building2,
  Home,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { UserRole } from "@/enum/role.enum";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(3, "Password must be at least 6 characters"),
  role: z.string(),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Helper function to get dashboard path based on user role
const getDashboardPath = (role: string): string => {
  switch (role) {
    case "ADMIN":
    case "SUPER_ADMIN":
      return "/admin";
    case "VENDOR":
      return "/vendor/dashboard";
    case "AGENT":
      return "/agent/dashboard";
    case "LANDLORD":
      return "/landlord/dashboard";
    default:
      return "/dashboard";
  }
};

const userTypes = [
  {
    value: "USER",
    label: "Regular User",
    icon: User,
    description: "Shop, save, and browse properties",
  },
  {
    value: "AGENT",
    label: "Real Estate Agent",
    icon: Building2,
    description: "List and manage properties",
  },
  {
    value: "LANDLORD",
    label: "Landlord",
    icon: Home,
    description: "Rent out your properties",
  },
];

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError, isAuthenticated, user } =
    useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("ADMIN | SUPER_ADMIN");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "ADMIN | SUPER_ADMIN",
    },
  });

  // Redirect if already authenticated with role-based path
  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardPath = getDashboardPath(user.role);
      navigate(dashboardPath, { replace: true });
    }
  }, [isAuthenticated, navigate, user]);

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    const result = await login(data.email, data.password, UserRole.SUPER_ADMIN);

    if (result.success && user) {
      // Check if selected role matches user's actual role
      if (data.role && data.role !== user.role) {
        toast.error(
          `This account is registered as a ${user.role}. Please select the correct account type.`
        );
        return;
      }

      toast.success(result.message || `Welcome back, ${user.firstName}!`);
      const dashboardPath = getDashboardPath(user.role);
      navigate(dashboardPath, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <AuthCard
        title="Welcome Back"
        subtitle="Sign in to your account"
        footer={
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-[var(--color-brand-primary)] hover:underline font-medium"
              >
                Create account
              </Link>
            </p>
            <p className="text-xs text-gray-500">
              <Link to="/forgot-password" className="hover:underline">
                Forgot password?
              </Link>
            </p>
          </div>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <FormInput
            control={control}
            name="email"
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            icon={<Mail size={18} />}
            error={errors.email?.message}
          />

          <div className="relative">
            <FormInput
              control={control}
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              icon={<Lock size={18} />}
              error={errors.password?.message}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[42px] text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)]"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Spinner size="sm" className="mx-auto" /> : "Sign In"}
          </Button>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <GoogleSignInButton
          preselectedRole={(selectedRole as UserRole) || undefined}
          variant="outline"
          className="w-full"
        />
      </AuthCard>
    </div>
  );
}
