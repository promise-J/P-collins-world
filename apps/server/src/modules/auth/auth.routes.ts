import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { AuthController } from "./auth.controller";
import { validate } from "../middleware/validate.middleware";
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from "./auth.validation";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
const controller = new AuthController();

// Public routes
router.post("/register", validate(registerSchema), asyncHandler(controller.register));
router.post("/login", validate(loginSchema), asyncHandler(controller.login));
router.post("/google", asyncHandler(controller.googleAuth));
router.post("/refresh", asyncHandler(controller.refresh));
router.post("/forgot-password", validate(forgotPasswordSchema), asyncHandler(controller.forgotPassword));
router.post("/reset-password/:token", validate(resetPasswordSchema), asyncHandler(controller.resetPassword));
router.get("/verify-email/:token", asyncHandler(controller.verifyEmail));
router.post("/resend-verification", asyncHandler(controller.resendVerification));

// Protected routes
router.get("/logout", authenticate, asyncHandler(controller.logout));

export default router;