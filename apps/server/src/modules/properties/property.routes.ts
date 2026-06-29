import { Router } from "express";
import { PropertyController } from "./property.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { UserRole } from "@/enum/role.enum";
import { upload } from "../../middleware/upload.middleware";

const router = Router();
const controller = new PropertyController();

// Public routes
router.get("/", asyncHandler(controller.list));
router.get("/search", asyncHandler(controller.search));
router.get("/recommendations", asyncHandler(controller.recommendations));
router.get("/:id", asyncHandler(controller.getOne));

// Protected routes - require authentication
router.use(authenticate);

// Favorites
router.get("/favorites", asyncHandler(controller.getFavorites));
router.post("/:id/favorite", asyncHandler(controller.addFavorite));
router.delete("/:id/favorite", asyncHandler(controller.removeFavorite));
router.get("/:id/favorite/check", asyncHandler(controller.checkFavorite));

// Recently viewed
router.get("/recently-viewed", asyncHandler(controller.getRecentlyViewed));

// Create property - requires specific roles
router.post(
  "/",
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.LANDLORD, UserRole.AGENT]),
  upload.array('images', 5),
  asyncHandler(controller.create)
);

// Update property - requires authentication
router.patch("/:id", asyncHandler(controller.update));

// Delete property - admin only
router.delete(
  "/:id",
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  asyncHandler(controller.delete)
);

// Admin approval routes
router.patch(
  "/:id/approve",
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  asyncHandler(controller.approveProperty)
);

router.patch(
  "/:id/reject",
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  asyncHandler(controller.rejectProperty)
);

export default router;