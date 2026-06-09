import streamifier
from "streamifier";

import cloudinary
from "../../config/cloudinary";

export class UploadService {

 async uploadFile(
  file: Express.Multer.File,
  folder: string
 ){

  return new Promise(
   (resolve,reject)=>{

    const stream =
      cloudinary.uploader.upload_stream(
       {
        folder,
        resource_type: "auto"
       },
       (error,result)=>{

        if(error){
          reject(error);
          return;
        }

        resolve(result);
       }
      );

      streamifier
      .createReadStream(file.buffer)
      .pipe(stream);

   }
  );

 }
 async deleteFile(
  publicId: string
 ){
  return cloudinary.uploader.destroy(publicId);

 }

}