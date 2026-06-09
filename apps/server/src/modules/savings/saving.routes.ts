import { Router } from "express";



import { asyncHandler } from "../../utils/asyncHandler";
import { SavingsController } from "./saving.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

const controller = new SavingsController();


// PERSONAL SAVINGS
router.post(
  "/plan",
  authenticate,
  asyncHandler(controller.createPlan)
);

router.get(
  "/plan",
  authenticate,
  asyncHandler(controller.getMyPlans)
);

router.post(
  "/plan/:id/contribute",
  authenticate,
  asyncHandler(controller.contributeToPlan)
);


// GROUP SAVINGS
router.post(
  "/group",
  authenticate,
  asyncHandler(controller.createGroup)
);

router.get(
  "/group",
  authenticate,
  asyncHandler(controller.getMyGroups)
);

router.post(
  "/group/:id/contribute",
  authenticate,
  asyncHandler(controller.contributeToGroup)
);


// BREAK SAVINGS (IMPORTANT)
router.post(
  "/plan/:id/break",
  authenticate,
  asyncHandler(controller.breakSavingsPlan)
);

router.post(
  "/group/:id/break",
  authenticate,
  asyncHandler(controller.breakGroupSavings)
);

export default router;