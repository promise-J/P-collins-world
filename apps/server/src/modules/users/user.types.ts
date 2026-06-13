import { Document, Types } from "mongoose";
import { UserRole } from "../../enum/role.enum";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  avatar: string;
  phone?: string;
  firebaseId?: string;
  role: UserRole;
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
  createdAt: Date;
  updatedAt: Date;
}


export interface IBankDetails {
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
}

export interface IPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export interface IProfile {
  userId: Types.ObjectId;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  bio?: string;
  occupation?: string;
  bankDetails?: IBankDetails;
  preferences: IPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProfileDocument extends IProfile, Document {}
