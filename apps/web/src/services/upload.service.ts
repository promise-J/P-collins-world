import { api } from "@/lib/axios";

export class UploadService {
  static async uploadFile(file: File, folder?: string) {
    const formData = new FormData();
    formData.append("file", file);
    if (folder) formData.append("folder", folder);

    const response = await api.post("/upload/single", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  static async uploadMultipleFiles(files: File[], folder?: string) {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    if (folder) formData.append("folder", folder);

    const response = await api.post("/upload/multiple", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
}