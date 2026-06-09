import { Router } from "express";
import { WalletController } from "./wallet.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
const controller = new WalletController();

router.get("/", authenticate, asyncHandler(controller.getWallet));
router.post("/fund", authenticate, asyncHandler(controller.fundWallet));
router.get("/verify", authenticate, asyncHandler(controller.verifyFunding));
router.post("/withdraw", authenticate, asyncHandler(controller.withdraw));
router.get("/transactions", authenticate, asyncHandler(controller.getTransactions));

export default router;