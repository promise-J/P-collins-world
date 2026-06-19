import { Router } from "express";
import { CategoryController } from "./category.controller";
import { UserRole } from "@/enum/role.enum";
import { asyncHandler } from "@/utils/asyncHandler";
import { authorize } from "@/modules/middleware/role.middleware";
import { authenticate } from "@/modules/middleware/auth.middleware";

const router = Router()
const controller = new CategoryController()

router.post("/", authenticate, authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]), asyncHandler(controller.create));
router.get("/", asyncHandler(controller.list));
router.get("/:slug", asyncHandler(controller.getBySlug));
router.patch("/:id", authenticate, authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]), asyncHandler(controller.update));
router.delete("/:id", authenticate, authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]), asyncHandler(controller.delete));


export default router