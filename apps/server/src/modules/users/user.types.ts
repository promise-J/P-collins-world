import { Document }
from "mongoose";
import { UserRole } from "../../enum/role.enum";

export interface IUser extends Document {

  firstName: string;

  lastName: string;

  email: string;

  password: string;

  role: UserRole;

  isVerified: boolean;

  refreshToken?: string;
}