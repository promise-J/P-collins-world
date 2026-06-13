import { useAuthStore } from "../store/auth.store";

export function useAuth() {
  const user = useAuthStore((state) => state.user);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const login = useAuthStore((state) => state.login);

  const logout = useAuthStore((state) => state.logout);

  return {
    user,
    login,
    logout,
    isAuthenticated,
  };
}
