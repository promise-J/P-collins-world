import { Router } from "express";

import { UserController } from "./user.controller";

import { asyncHandler } from "../../utils/asyncHandler";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "@/middleware/upload.middleware";

const router = Router();

const controller = new UserController();

router.get("/me", authenticate, asyncHandler(controller.getMe));

router.patch("/role", authenticate, asyncHandler(controller.updateRole));

router.put("/profile", authenticate, asyncHandler(controller.completeProfile));

router.get("/me", authenticate, asyncHandler(controller.getMe));
router.put("/profile", authenticate, asyncHandler(controller.updateProfile));
router.post(
  "/avatar",
  authenticate,
  upload.single("avatar"),
  asyncHandler(controller.updateAvatar)
);
router.post(
  "/change-password",
  authenticate,
  asyncHandler(controller.changePassword)
);
router.put(
  "/bank-details",
  authenticate,
  asyncHandler(controller.updateBankDetails)
);

export default router;
