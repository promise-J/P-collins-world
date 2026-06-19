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
router.post("/group", authenticate, asyncHandler(controller.createGroup));
router.get("/group", authenticate, asyncHandler(controller.getMyGroups));
router.get("/group/all", authenticate, asyncHandler(controller.getAllGroups));
router.get("/group/:id", authenticate, asyncHandler(controller.getGroupDetails));
router.post("/group/:id/join", authenticate, asyncHandler(controller.joinGroup));
router.post("/group/:id/leave", authenticate, asyncHandler(controller.leaveGroup));
router.post("/group/:id/contribute", authenticate, asyncHandler(controller.contributeToGroup));
router.post("/group/:id/break", authenticate, asyncHandler(controller.breakGroupSavings));
router.delete("/group/:id", authenticate, asyncHandler(controller.deleteGroup));
router.patch("/group/:id", authenticate, asyncHandler(controller.updateGroup));


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