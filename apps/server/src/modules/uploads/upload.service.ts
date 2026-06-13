import streamifier from "streamifier";
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import cloudinary from "../../config/cloudinary";

export class UploadService {
  async uploadFile(
    file: Express.Multer.File,
    folder: string
  ): Promise<UploadApiResponse> { // 👈 Add type here
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(error);
            return;
          }
          if (!result) {
            reject(new Error("Cloudinary upload returned no result."));
            return;
          }
          resolve(result);
        }
      );

      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  }

  async deleteFile(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  }
}
