import {Router} from "express";


import { AdminController } from "../controllers/admin.controller";
import { asyncHandler } from "@/utils/asyncHandler";
import { authenticate } from "@/modules/middleware/auth.middleware";
import { authorize } from "@/modules/middleware/role.middleware";
import { UserRole } from "@/enum/role.enum";
import { validate } from "../../middleware/validate.middleware";
import { loginSchema } from "../admin.validation";
import { DisputeController } from "../controllers/dispute.controller";

const router = Router();

const controller = new AdminController();
const disputeController = new DisputeController();

router.post("/login", validate(loginSchema), asyncHandler(controller.login));

router.get(
    "/dashboard",
    authenticate,
    authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    asyncHandler(controller.dashboardMetrics)
  );
  
  router.get(
    "/users",
    authenticate,
    authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    asyncHandler(controller.getUsers)
  );
  
  router.get(
    "/analytics/revenue",
    authenticate,
    authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    asyncHandler(controller.monthlyRevenue)
  );


  router.get(
    "/analytics/pending-kyc",
    authenticate,
    authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    asyncHandler(controller.pendingKyc)
  );
  router.get(
    "/analytics/top-products",
    authenticate,
    authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    asyncHandler(controller.topProducts)
  );
  router.get(
    "/analytics/total-savings",
    authenticate,
    authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    asyncHandler(controller.totalSavings)
  );

  router.patch(
    "/users/:userId/role",
    authenticate,
    authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    asyncHandler(controller.updateUserRole)
  );

  router.get(
    "/disputes",
    authenticate,
    authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    asyncHandler(disputeController.getDisputes)
  );
  
  router.get(
    "/disputes/stats",
    authenticate,
    authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    asyncHandler(disputeController.getDisputeStats)
  );
  
  router.get(
    "/disputes/:id",
    authenticate,
    authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    asyncHandler(disputeController.getDisputeById)
  );
  
  router.post(
    "/disputes",
    authenticate,
    authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    asyncHandler(disputeController.createDispute)
  );
  
  router.patch(
    "/disputes/:id/resolve",
    authenticate,
    authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    asyncHandler(disputeController.resolveDispute)
  );
  
  router.patch(
    "/disputes/:id/escalate",
    authenticate,
    authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    asyncHandler(disputeController.escalateDispute)
  );
  
  router.patch(
    "/disputes/:id/close",
    authenticate,
    authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    asyncHandler(disputeController.closeDispute)
  );
  
  router.patch(
    "/disputes/:id/priority",
    authenticate,
    authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    asyncHandler(disputeController.updateDisputePriority)
  );

export default router