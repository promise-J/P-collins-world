import { UserRole } from "@/enum/role.enum";

// Declare modifications to the global Express namespace
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
      };
    }
  }
}
