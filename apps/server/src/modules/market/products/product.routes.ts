import { Router } from "express";
import { ProductController } from "./product.controller"
import { authenticate } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../../utils/asyncHandler";
import { authorize } from "@/modules/middleware/role.middleware";
import { UserRole } from "@/enum/role.enum";
import { upload } from "@/middleware/upload.middleware";

const router = Router();

const controller = new ProductController();

router.post(
  "/",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  upload.array('images', 5),
  asyncHandler(controller.create)
);

router.get(
  "/",
  asyncHandler(controller.list)
);

router.get(
  "/search",
  asyncHandler(controller.search)
);

router.get(
  "/:id",
  asyncHandler(controller.getOne)
);

export default router;