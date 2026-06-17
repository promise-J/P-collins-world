import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/ui/components/Button";
import { FormInput } from "@/ui/forms/FormInput";
import { Spinner } from "@/ui/feedback/Spinner";
import { Eye, EyeOff, Mail, Lock, User, Building2, Home, Store } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { UserRole } from "@/enum/role.enum";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(3, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;


const roleIcons: Record<string, any> = {
  USER: User,
  AGENT: Building2,
  LANDLORD: Home,
  VENDOR: Store,
};

const roleLabels: Record<string, string> = {
  USER: "Regular User",
  AGENT: "Real Estate Agent",
  LANDLORD: "Landlord",
  VENDOR: "Vendor",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const selectedRole = searchParams.get("role") || "USER";
  
  const { login, isLoading, error, clearError, isAuthenticated, user } =
    useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate, user]);

  // If no role is selected, redirect to role selection
  useEffect(() => {
    if (!searchParams.get("role")) {
      navigate("/role-selection?mode=login", { replace: true });
    }
  }, [searchParams, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    const result = await login(data.email, data.password, selectedRole as UserRole);

    if (result.success && user) {
      toast.success(result.message || `Welcome back, ${user.firstName}!`);
      window.location.replace('/dashboard')
    }
  };

  const RoleIcon = roleIcons[selectedRole] || User;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <AuthCard
        title="Welcome Back"
        subtitle={
          <span className="flex items-center justify-center gap-2">
            <RoleIcon size={18} className="text-[var(--color-brand-primary)]" />
            {roleLabels[selectedRole] || "User"}
          </span>
        }
        footer={
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Wrong account type?{" "}
              <Link
                to="/role-selection?mode=login"
                className="text-[var(--color-brand-primary)] hover:underline font-medium"
              >
                Change role
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to={`/register?role=${selectedRole}`}
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
          variant="outline" 
          className="w-full"
          preselectedRole={selectedRole as UserRole}
        />
      </AuthCard>
    </div>
  );
}