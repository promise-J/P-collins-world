import { Response } from "express";

import { UploadService }
from "./upload.service";

export class UploadController {

 private service =
 new UploadService();

 upload =
 async(
  req:any,
  res:Response
 )=>{

   const result =
   await this.service.uploadFile(
     req.file,
     req.body.folder
   );

   res.json(result);

 };

}