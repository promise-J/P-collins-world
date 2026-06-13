import {
    Request,
    Response,
    NextFunction
  }
  from "express";
  
  import { JwtService }
  from "../services/jwt.service";
import { UserModel } from "../users/user.model";
  
  export const authenticate =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
  
    const token = req.cookies.accessToken;
  
    if(!token){
  
      return res.status(401).json({
        message:"Unauthorized"
      });
    }

  
    const decoded =
      JwtService.verifyAccessToken(
        token
      );
  
      const userId = decoded.userId;
      const user = await UserModel.findById(userId);

      if(!user){
        return res.status(401).json({message: "User not found"})
      }
      req.user = user;
  
    next();
  };