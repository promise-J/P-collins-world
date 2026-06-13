import { UserRole } from "@/enum/role.enum";
import { IUser } from "@/modules/users/user.types";

// Declare modifications to the global Express namespace
declare global {
  namespace Express {
    interface Request {
      user?: IUser
    }
  }
}
