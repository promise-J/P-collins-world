import { Request, Response, NextFunction } from "express";
import { UserRole } from "@/enum/role.enum";

export const authorize = (roles: UserRole | UserRole[]) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role as UserRole;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: "Forbidden"
      });
    }

    next();
  };
};
