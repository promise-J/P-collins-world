import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, 
  Building2, 
  Home, 
  ArrowRight,
  Check
} from "lucide-react";
import { UserRole } from "@/enum/role.enum";

const ROLES = [
  {
    value: UserRole.USER,
    label: "Regular User",
    icon: User,
    description: "Shop, save, and browse properties",
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
    features: ["Access to marketplace", "Personal savings", "Property browsing"]
  },
  {
    value: UserRole.AGENT,
    label: "Real Estate Agent",
    icon: Building2,
    description: "List and manage properties for clients",
    color: "from-purple-500 to-purple-600",
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-200",
    features: ["List properties", "Manage inquiries", "Property analytics"]
  },
  {
    value: UserRole.LANDLORD,
    label: "Landlord",
    icon: Home,
    description: "Rent out and manage your properties",
    color: "from-green-500 to-green-600",
    bg: "bg-green-50",
    text: "text-green-600",
    border: "border-green-200",
    features: ["List rental properties", "Manage tenants", "Track earnings"]
  }
];

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Get mode from URL query param, default to "login"
  const mode = searchParams.get("mode") || "login";
  
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.USER);
  const [isHovered, setIsHovered] = useState<string | null>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Update selected role when mode changes
  useEffect(() => {
    // You could set a default role based on mode if needed
    // For example, if mode is "register", maybe set to USER by default
  }, [mode]);

  const handleContinue = () => {
    const basePath = mode === "login" ? "/login" : "/register";
    navigate(`${basePath}?role=${selectedRole}`);
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-[var(--color-brand-text)] mb-3">
              {mode === "login" ? "Welcome Back" : "Join P Collins"}
            </h1>
            <p className="text-gray-500 text-lg">
              {mode === "login" 
                ? "Select your account type to continue" 
                : "Choose the type of account you want to create"}
            </p>
          </motion.div>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => navigate("/role-selection?mode=login")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                mode === "login"
                  ? "bg-white shadow-sm text-[var(--color-brand-primary)]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/role-selection?mode=register")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                mode === "register"
                  ? "bg-white shadow-sm text-[var(--color-brand-primary)]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {ROLES.map((role, index) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.value;
            const isHoveredState = isHovered === role.value;

            return (
              <motion.div
                key={role.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onMouseEnter={() => setIsHovered(role.value)}
                onMouseLeave={() => setIsHovered(null)}
                onClick={() => handleRoleSelect(role.value)}
                className={`
                  relative cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300
                  ${isSelected 
                    ? `border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5 shadow-lg scale-[1.02]` 
                    : `border-gray-200 hover:border-gray-300 hover:shadow-md`
                  }
                  ${isHoveredState && !isSelected ? 'scale-[1.02]' : ''}
                `}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--color-brand-primary)] rounded-full flex items-center justify-center shadow-lg">
                    <Check size={14} className="text-white" />
                  </div>
                )}

                <div className="flex flex-col items-center text-center">
                  <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300
                    ${isSelected ? 'bg-[var(--color-brand-primary)] text-white' : 'bg-gray-100 text-gray-500'}
                  `}>
                    <Icon size={28} />
                  </div>

                  <h3 className={`text-lg font-semibold mb-1 transition-colors duration-300
                    ${isSelected ? 'text-[var(--color-brand-primary)]' : 'text-gray-800'}
                  `}>
                    {role.label}
                  </h3>

                  <p className="text-sm text-gray-500 mb-4">
                    {role.description}
                  </p>

                  <ul className="text-xs text-gray-400 space-y-1 w-full">
                    {role.features.map((feature, i) => (
                      <li key={i} className="flex items-center justify-center gap-1">
                        <span className="text-[var(--color-brand-primary)]">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <button
            onClick={handleContinue}
            className="inline-flex items-center gap-3 px-8 py-3 bg-[var(--color-brand-primary)] text-white rounded-xl font-semibold hover:bg-[var(--color-brand-primary-dark)] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            {mode === "login" ? "Continue to Login" : "Continue to Sign Up"}
            <ArrowRight size={20} />
          </button>

          <div className="mt-4 text-sm text-gray-500">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/role-selection?mode=register")}
                  className="text-[var(--color-brand-primary)] hover:underline font-medium"
                >
                  Create account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/role-selection?mode=login")}
                  className="text-[var(--color-brand-primary)] hover:underline font-medium"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}