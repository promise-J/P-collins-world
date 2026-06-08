import { UserRole } from "@/enum/role.enum";


export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Optional because password hashes are often excluded in queries
  avatar?: string;
  phone?: string;
  address?: string;
  role: UserRole; // Uses your exact UserRole enum values
  verificationToken?: string;
  verificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  isVerified: boolean;
  refreshToken?: string;
  profileCompleted: boolean;
  lastLoginAt?: Date;
  isSuspended: boolean;
  suspensionReason?: string;
  verifiedAgent: boolean;
  verifiedLandlord: boolean;
  
  // Base schema timestamps (Assuming baseSchemaOptions includes timestamps: true)
  createdAt?: Date;
  updatedAt?: Date;
}
