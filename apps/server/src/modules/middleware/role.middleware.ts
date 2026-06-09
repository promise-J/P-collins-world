import {
    Request,
    Response,
    NextFunction
  }
  from "express";
import { UserRole } from "@/enum/role.enum";
  
  
  export const authorize =
  (...roles:UserRole[]) =>
  (
    req:Request,
    res:Response,
    next:NextFunction
  )=>{
  
    if(
      !roles.includes(
        req.user?.role as UserRole
      )
    ){
  
      return res.status(403)
        .json({
          message:"Forbidden"
        });
    }
  
    next();
  };