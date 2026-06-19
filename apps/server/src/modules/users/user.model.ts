import mongoose from "mongoose";
import {
  baseSchemaFields,
  baseSchemaOptions,
} from "../shared/database/base.schema";
import { UserRole } from "../../enum/role.enum";
import { autoConvertObjectIdsAsync } from "@/utils/mongoose-plugins";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default:
        "https://cdn.vectorstock.com/i/1000v/41/91/avatar-default-user-profile-icon-simple-flat-grey-vector-57234191.jpg",
    },

    phone: { type: String },
    firebaseId: {
      type: String,
      sparse: true,
      index: true,
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },

    verificationToken: {
      type: String,
    },
    verificationExpires: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    refreshToken: { type: String },
    profileCompleted: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    suspensionReason: { type: String },
    verifiedAgent: {
      type: Boolean,
      default: false,
    },
    verifiedLandlord: {
      type: Boolean,
      default: false,
    },
    businessName: {
      type: String,
    },
    settingsId: {
    type: mongoose.Types.ObjectId,
    ref: "UserSettings",
  },
    ...baseSchemaFields,
  },
  baseSchemaOptions
);

userSchema.plugin(autoConvertObjectIdsAsync(['settingsId']))


export const UserModel = mongoose.model("User", userSchema);
