import { Router } from "express";

import { UserController } from "./user.controller";


import { asyncHandler } from "../../utils/asyncHandler";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

const controller = new UserController();

router.get("/me", authenticate, asyncHandler(controller.getMe));

router.patch(
  "/role",
  authenticate,
  asyncHandler(controller.updateRole)
);

router.put(
  "/profile",
  authenticate,
  asyncHandler(controller.completeProfile)
);

export default router;