
import { UploadApiResponse } from "cloudinary";
import { UploadService } from "../uploads/upload.service";

const uploadService = new UploadService();

export interface MediaUploadResult {
  url: string;
  publicId: string;
  type: "image" | "video" | "document";
  originalName?: string;
  size?: number;
}

export class MediaUploadService {
  /**
   * Upload multiple files to Cloudinary
   * @param files - Array of uploaded files from multer
   * @param folder - Cloudinary folder name
   * @param resourceType - Cloudinary resource type (auto, image, video, raw)
   * @returns Array of media objects
   */
  static async uploadMultiple(
    files: Express.Multer.File[] | undefined,
    folder: string = "uploads",
    resourceType: "auto" | "image" | "video" | "raw" = "auto"
  ): Promise<MediaUploadResult[]> {
    const results: MediaUploadResult[] = [];

    if (!files || files.length === 0) {
      return results;
    }


    for (const file of files) {
      try {
        const result = await uploadService.uploadFile(file, folder, resourceType);
        
        results.push({
          url: result.secure_url,
          publicId: result.public_id,
          type: this.getMediaType(file.mimetype),
          originalName: file.originalname,
          size: file.size,
        });
      } catch (error) {
        console.error(`❌ Failed to upload ${file.originalname}:`, error);
        // Continue with other files
      }
    }

    console.log(`✅ Successfully uploaded ${results.length}/${files.length} files`);
    return results;
  }

  /**
   * Upload a single file to Cloudinary
   */
  static async uploadSingle(
    file: Express.Multer.File | undefined,
    folder: string = "uploads",
    resourceType: "auto" | "image" | "video" | "raw" = "auto"
  ): Promise<MediaUploadResult | null> {
    if (!file) {
      return null;
    }

    try {
      const result = await uploadService.uploadFile(file, folder, resourceType);
      
      return {
        url: result.secure_url,
        publicId: result.public_id,
        type: this.getMediaType(file.mimetype),
        originalName: file.originalname,
        size: file.size,
      };
    } catch (error) {
      console.error(`❌ Failed to upload ${file.originalname}:`, error);
      return null;
    }
  }

  /**
   * Determine media type from mime type
   */
  private static getMediaType(mimeType: string): "image" | "video" | "document" {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    return "document";
  }

  /**
   * Delete multiple files from Cloudinary
   */
  static async deleteMultiple(publicIds: string[]): Promise<void> {
    for (const publicId of publicIds) {
      try {
        await uploadService.deleteFile(publicId);
        console.log(`🗑️ Deleted: ${publicId}`);
      } catch (error) {
        console.error(`❌ Failed to delete ${publicId}:`, error);
      }
    }
  }
}