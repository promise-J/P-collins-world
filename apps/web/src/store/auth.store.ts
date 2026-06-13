import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthService, ApiResponse } from '@/services/auth.service';
import { api } from '@/lib/axios';
import { FirebaseService } from '@/services/firebase.service';
import { UserRole } from '@/enum/role.enum';
import { RegisterData, User, UserProfile } from '@/types/user.type';




interface AuthState {
  user: User | null;
  profile: UserProfile | null
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  verifyEmail: (token: string) => Promise<{ success: boolean; message?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; message?: string }>;
  resendVerification: (email: string) => Promise<{ success: boolean; message?: string }>;
  googleLogin: () => Promise<{ success: boolean; message?: string }>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
  setProfile: (user: UserProfile | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isLoading: true,
      error: null,
      isAuthenticated: false,

      checkAuth: async () => {
        
        const localAuthStore = JSON.parse(localStorage.getItem('auth-storage') || "")
        if (!localAuthStore.state.isAuthenticated) {
          set({ isLoading: false, isAuthenticated: false });
          return;
        }

        try {
          const response: ApiResponse = await AuthService.me();
          
          if (response.success && response.data) {
            set({
              user: response.data.user || response.data,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            throw new Error(response.message);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await AuthService.login({ email, password });
          
          if (response.success && response.data) {
            const user = response.data;

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
            
            return { success: true, message: response.message };
          } else {
            set({
              error: response.message || 'Login failed',
              isLoading: false,
            });
            return { success: false, message: response.message };
          }
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || 'Login failed';
          set({
            error: errorMessage,
            isLoading: false,
          });
          return { success: false, message: errorMessage };
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await AuthService.register(data);
          
          if (response.success) {
            set({ isLoading: false });
            return { success: true, message: response.message };
          } else {
            set({
              error: response.message || 'Registration failed',
              isLoading: false,
            });
            return { success: false, message: response.message };
          }
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || 'Registration failed';
          set({
            error: errorMessage,
            isLoading: false,
          });
          return { success: false, message: errorMessage };
        }
      },
      getUser: async () => {
        try {
         const user = get().user;
         return {success: true, message: user}
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || 'Registration failed';
          set({
            error: errorMessage,
            isLoading: false,
          });
          return { success: false, message: errorMessage };
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await AuthService.logout();
          await FirebaseService.logout(); // Also logout from Firebase
        } catch (err) {
          console.error('Logout error:', err);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
        }
      },

      verifyEmail: async (token) => {
        set({ isLoading: true });
        try {
          const response = await AuthService.verifyEmail(token);
          set({ isLoading: false });
          return { success: response.success, message: response.message };
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || 'Verification failed';
          set({ isLoading: false, error: errorMessage });
          return { success: false, message: errorMessage };
        }
      },

      forgotPassword: async (email) => {
        set({ isLoading: true });
        try {
          const response = await AuthService.forgotPassword({ email });
          set({ isLoading: false });
          return { success: response.success, message: response.message };
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || 'Failed to send reset email';
          set({ isLoading: false, error: errorMessage });
          return { success: false, message: errorMessage };
        }
      },

      resetPassword: async (token, password) => {
        set({ isLoading: true });
        try {
          const response = await AuthService.resetPassword(token, { password });
          set({ isLoading: false });
          return { success: response.success, message: response.message };
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || 'Failed to reset password';
          set({ isLoading: false, error: errorMessage });
          return { success: false, message: errorMessage };
        }
      },

      resendVerification: async (email) => {
        set({ isLoading: true });
        try {
          const response = await AuthService.resendVerification({ email });
          set({ isLoading: false });
          return { success: response.success, message: response.message };
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || 'Failed to resend verification';
          set({ isLoading: false, error: errorMessage });
          return { success: false, message: errorMessage };
        }
      },

      googleLogin: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await FirebaseService.signInWithGoogle();
          
          if (response.success && response.data) {
            const { user } = response.data;
            
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
            
            
            return { success: true, message: response.message };
          } else {
            set({
              error: response.message || 'Google login failed',
              isLoading: false,
            });
            return { success: false, message: response.message };
          }
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || 'Google login failed';

          const isPopupClosed = err.code === 'auth/popup-closed-by-user' || 
          err.message?.includes('popup-closed-by-user');

          set({
            error: errorMessage,
            isLoading: false,
          });
          return { success: false, message: errorMessage };
        }
      },
      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),

      partialize: (state: AuthState) => ({ 
      user: state.user, 
      isAuthenticated: state.isAuthenticated 
      }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// const token = localStorage.getItem('token');
// if (token) {
//   useAuthStore.getState().checkAuth();
// } else {
//   useAuthStore.setState({ isLoading: false });
// }