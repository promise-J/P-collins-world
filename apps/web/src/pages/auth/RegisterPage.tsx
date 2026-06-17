import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { Input } from "@/ui/components/Input";
import { Eye, EyeOff, User, Building2, Home, Store } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { UserRole } from "@/enum/role.enum";
import toast from "react-hot-toast";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    password: z.string().min(4, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    businessName: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterDataWithRole {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  businessName?: string;
  role: UserRole;
}

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

const requiresBusinessName = (role: string): boolean => {
  return ["AGENT", "LANDLORD", "VENDOR"].includes(role);
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedRole = (searchParams.get("role") || "USER") as UserRole;
  
  const { register: registerUser, isLoading, error, clearError, isAuthenticated } =
    useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      businessName: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // If no role is selected, redirect to role selection
  useEffect(() => {
    if (!searchParams.get("role")) {
      navigate("/role-selection?mode=register", { replace: true });
    }
  }, [searchParams, navigate]);

  const onSubmit = async (data: RegisterFormData) => {
    clearError();
    
    // Exclude confirmPassword (it's only for validation)
    const { confirmPassword, ...registerData } = data;
    
    // Create the registration data with role
    const registrationData: RegisterDataWithRole = {
      ...registerData,
      role: selectedRole,
    };
    
    const result = await registerUser(registrationData);

    if (result.success) {
      toast.success(result.message || "Account created successfully! Please check your email.");
      window.location.href = `/check-email?email=${encodeURIComponent(data.email)}`;
    } else {
      toast.error(result.message || "Registration failed. Please try again.");
    }
  };

  const RoleIcon = roleIcons[selectedRole] || User;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Create Account
          </h1>
          <p className="text-gray-600 mt-1 flex items-center justify-center gap-2">
            <RoleIcon size={18} className="text-[var(--color-brand-primary)]" />
            {roleLabels[selectedRole] || "User"}
          </p>
          <Link
            to="/role-selection?mode=register"
            className="text-xs text-[var(--color-brand-primary)] hover:underline"
          >
            Change role
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="John"
              {...register("firstName")}
              error={errors.firstName?.message}
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              {...register("lastName")}
              error={errors.lastName?.message}
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            error={errors.email?.message}
          />

          <Input
            label="Phone Number (Optional)"
            type="tel"
            placeholder="+234 123 456 7890"
            {...register("phone")}
            error={errors.phone?.message}
          />

          {requiresBusinessName(selectedRole) && (
            <Input
              label="Business / Company Name"
              placeholder="e.g., ABC Realty Ltd"
              {...register("businessName")}
              error={errors.businessName?.message}
            />
          )}

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              {...register("password")}
              error={errors.password?.message}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[42px] text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[42px] text-gray-400"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#8B3A3A] text-white rounded-lg font-medium hover:bg-[#6B2C2C] transition-colors disabled:opacity-50"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to={`/login?role=${selectedRole}`} className="text-[#8B3A3A] hover:underline">
              Sign in
            </Link>
          </p>

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
          preselectedRole={selectedRole}
        />
      </div>
    </div>
  );
}