import { UserRole } from "@/enum/role.enum";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  phone?: string;
  firebaseId?: string;
  role: UserRole;
  isVerified: boolean;
  profileCompleted: boolean;
  lastLoginAt?: string;
  isSuspended: boolean;
  suspensionReason?: string;
  verifiedAgent: boolean;
  verifiedLandlord: boolean;
  createdAt: string; 
  updatedAt: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface BankDetails {
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
}

export interface ProfilePreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export interface UserProfile {
  _id: string;
  userId: string; 
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  bio?: string;
  occupation?: string;
  bankDetails?: BankDetails;
  preferences: ProfilePreferences;
  createdAt: string;
  updatedAt: string;
}