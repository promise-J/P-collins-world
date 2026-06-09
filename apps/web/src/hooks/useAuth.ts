import { authStore } from "../store/auth.store";

export function useAuth() {
  const user = authStore((state) => state.user);

  const token = authStore((state) => state.token);

  const login = authStore((state) => state.login);

  const logout = authStore((state) => state.logout);

  return {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
  };
}
