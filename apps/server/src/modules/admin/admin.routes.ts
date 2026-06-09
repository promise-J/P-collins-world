import {Router} from "express";


import { AdminController } from "./admin.controller";
import { asyncHandler } from "@/utils/asyncHandler";
import { authenticate } from "@/modules/middleware/auth.middleware";
import { authorize } from "@/modules/middleware/role.middleware";
import { UserRole } from "@/enum/role.enum";

const router = Router();

const controller = new AdminController();

router.get(
    "/dashboard",
    authenticate,
    authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    asyncHandler(controller.dashboardMetrics)
  );
  
  router.get(
    "/users",
    authenticate,
    authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    asyncHandler(controller.getUsers)
  );
  
  router.get(
    "/analytics/revenue",
    authenticate,
    authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    asyncHandler(controller.monthlyRevenue)
  );


  router.get(
    "/analytics/pending-kyc",
    authenticate,
    authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    asyncHandler(controller.pendingKyc)
  );
  router.get(
    "/analytics/top-products",
    authenticate,
    authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    asyncHandler(controller.topProducts)
  );
  router.get(
    "/analytics/total-savings",
    authenticate,
    authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    asyncHandler(controller.totalSavings)
  );

export default router