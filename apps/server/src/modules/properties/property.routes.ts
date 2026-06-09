import { Router } from "express";

import { PropertyController } from "./property.controller";

import { asyncHandler } from "../../utils/asyncHandler";
import { authenticate } from "../middleware/auth.middleware";


const router = Router();

const controller = new PropertyController();

router.post("/", authenticate, asyncHandler(controller.create));

router.get("/", asyncHandler(controller.list));

router.get("/search", asyncHandler(controller.search));

router.get("/:id", asyncHandler(controller.getOne));

router.patch("/:id", authenticate, asyncHandler(controller.update));

export default router;