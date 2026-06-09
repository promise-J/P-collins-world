import { Router } from "express";

import { upload }
from "../../middleware/upload.middleware";
import { authenticate } from "../middleware/auth.middleware";
import { UploadController } from "./upload.controller";

const router = Router();
const controller = new UploadController();

router.post(
 "/single",
 authenticate,
 upload.single("file"),
 controller.upload
);

export default router;