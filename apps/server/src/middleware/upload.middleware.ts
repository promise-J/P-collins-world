import multer from "multer";
import { Request } from "express";

// 1. Define your allowed mime-types
const ALLOWED_MIMETYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "video/mp4",
  "video/webm"
];

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  // 2. Add the fileFilter configuration hook
  fileFilter: (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
    if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
      callback(null, true); // File is valid, proceed to controller
    } else {
      // Reject file with a custom error message
      callback(new Error("Invalid file type. Only PNG, JPEG, WEBP, MP4, and WEBM are allowed."));
    }
  }
});
