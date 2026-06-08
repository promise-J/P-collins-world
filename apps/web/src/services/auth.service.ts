import { api } from "@/lib/axios";


export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export class AuthService {
  static async register(payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<ApiResponse> {
    const response = await api.post("/auth/register", payload);
    return response.data;
  }

  static async login(payload: { email: string; password: string }): Promise<ApiResponse<{ user: any; accessToken: string; refreshToken: string }>> {
    const response = await api.post("/auth/login", payload);
    return response.data;
  }

  static async logout(): Promise<ApiResponse> {
    const response = await api.post("/auth/logout");
    return response.data;
  }

  static async me(): Promise<ApiResponse> {
    const response = await api.get("/users/me");
    return response.data;
  }

  static async forgotPassword(payload: { email: string }): Promise<ApiResponse> {
    const response = await api.post("/auth/forgot-password", payload);
    return response.data;
  }

  static async resetPassword(token: string, payload: { password: string }): Promise<ApiResponse> {
    const response = await api.post(`/auth/reset-password/${token}`, payload);
    return response.data;
  }

  static async verifyEmail(token: string): Promise<ApiResponse> {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  }

  static async resendVerification(payload: { email: string }): Promise<ApiResponse> {
    const response = await api.post("/auth/resend-verification", payload);
    return response.data;
  }

  static async refreshToken(): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
    const response = await api.post("/auth/refresh");
    return response.data;
  }
}