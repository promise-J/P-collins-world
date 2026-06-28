import { Router } from "express";

import { PropertyController } from "./property.controller";

import { asyncHandler } from "../../utils/asyncHandler";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { UserRole } from "@/enum/role.enum";
import { upload } from "@/middleware/upload.middleware";

const router = Router();

const controller = new PropertyController();

router.post(
  "/",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.LANDLORD, UserRole.AGENT]),
  upload.array('images', 5),
  asyncHandler(controller.create)
);

router.get("/", asyncHandler(controller.list));

router.get("/search", asyncHandler(controller.search));

router.get("/:id", asyncHandler(controller.getOne));

router.patch("/:id", authenticate, asyncHandler(controller.update));

export default router;
