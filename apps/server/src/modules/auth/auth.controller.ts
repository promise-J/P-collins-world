import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { apiResponse } from "../../utils/apiResponse";

export class AuthController {
  private service = new AuthService();

  register = async (req: Request, res: Response) => {
    const result = await this.service.register(req.body);
    return apiResponse(res, result.success, result.message, result.data);
  };

  login = async (req: Request, res: Response) => {
    const result = await this.service.login(req.body.email, req.body.password, req.body.role);

    if (!result.success) {
      return apiResponse(res, false, result.message);
    }

    const refreshToken = result.data?.refreshToken;
    const accessToken = result.data?.accessToken;

    // Set refresh token in httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return apiResponse(res, true, "Login successful", result.data?.user);
  };

  googleAuth = async (req: Request, res: Response) => {
    const result = await this.service.googleAuth(req.body);
    if (!result.success) {
      return apiResponse(res, false, result.message);
    }
    
    const refreshToken = result.data?.refreshToken;
    const accessToken = result.data?.accessToken;
    
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    
    return apiResponse(res, true, "Google login successful", result.data?.user);
  };

  logout = async (req: any, res: Response) => {
    const userId = req.user?._id;
    if (userId) {
      await this.service.logout(userId);
    }
    
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    
    return apiResponse(res, true, "Logout successful");
  };

  refresh = async (req: any, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return apiResponse(res, false, "No refresh token provided", null);
    }
    
    const result = await this.service.refresh(refreshToken);
    
    if (!result.success) {
      return apiResponse(res, false, result.message, null);
    }
    
    // Set new tokens in cookies
    res.cookie("refreshToken", result.data?.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    res.cookie("accessToken", result.data?.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    
    return apiResponse(res, true, "Token refreshed", { 
      accessToken: result.data?.accessToken 
    });
  };

  verifyEmail = async (req: Request, res: Response) => {
    const result = await this.service.verifyEmail(req.params.token as string);
    return apiResponse(res, result.success, result.message);
  };

  resendVerification = async (req: Request, res: Response) => {
    const result = await this.service.resendVerification(req.body.email);
    return apiResponse(res, result.success, result.message);
  };

  forgotPassword = async (req: Request, res: Response) => {
    const result = await this.service.forgotPassword(req.body.email);
    return apiResponse(res, result.success, result.message);
  };

  resetPassword = async (req: Request, res: Response) => {
    const result = await this.service.resetPassword(req.params.token as string, req.body.password);
    return apiResponse(res, result.success, result.message);
  };
}