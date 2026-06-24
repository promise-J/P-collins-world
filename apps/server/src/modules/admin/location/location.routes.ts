import { Router } from "express";
import { LocationController } from "./location.controller";
import { authenticate } from "@/modules/middleware/auth.middleware";
import { authorize } from "@/modules/middleware/role.middleware";
import { UserRole } from "@/enum/role.enum";
import { asyncHandler } from "@/utils/asyncHandler";

const router = Router();
const controller = new LocationController();

// Public routes (for checkout)
router.get("/active", asyncHandler(controller.getActiveLocations));
router.get("/state/:state", asyncHandler(controller.getLocationByState));

// Admin routes
router.use(authenticate);
router.use(authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]));

router.get("/", asyncHandler(controller.getAllLocations));
router.post("/", asyncHandler(controller.upsertLocation));
router.patch("/:state/toggle", asyncHandler(controller.toggleState));
router.delete("/:state", asyncHandler(controller.deleteState));

// LGA routes
router.post("/:state/lgas", asyncHandler(controller.addLGA));
router.patch("/:state/lgas/:lga/toggle", asyncHandler(controller.toggleLGA));
router.patch("/:state/lgas/:lga", asyncHandler(controller.updateLGA));
router.delete("/:state/lgas/:lga", asyncHandler(controller.removeLGA));

// Seed route (for initial setup)
router.post("/seed", asyncHandler(controller.seedLocations));

export default router;