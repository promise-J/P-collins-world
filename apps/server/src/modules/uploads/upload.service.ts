import streamifier from "streamifier";
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary"; // 👈 Add this import
import cloudinary from "../../config/cloudinary";

export class UploadService {
  // Explicitly return a Promise containing Cloudinary's api response layout
  async uploadFile(
    file: Express.Multer.File,
    folder: string = "uploads",
    resourceType: "auto" | "image" | "video" | "raw" = "auto"
  ): Promise<UploadApiResponse> {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          public_id: `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
            return;
          }
          if (!result) {
            reject(new Error("Cloudinary upload returned no result"));
            return;
          }
          resolve(result);
        }
      );

      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  }

  async deleteFile(publicId: string) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log(`🗑️ Deleted from Cloudinary: ${publicId}`);
      return result;
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      throw error;
    }
  }

}
