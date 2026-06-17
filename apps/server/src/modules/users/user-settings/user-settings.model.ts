import mongoose from "mongoose";

export enum Currency {
  NGN = "NGN",
  USD = "USD",
  GBP = "GBP",
  EUR = "EUR",
}

export enum Language {
  EN = "en",
  FR = "fr",
  ES = "es",
  PT = "pt",
}

export enum Theme {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system",
}

const userSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // Profile settings
    profile: {
      firstName: { type: String },
      lastName: { type: String },
      phone: { type: String },
      currency: {
        type: String,
        enum: Object.values(Currency),
        default: Currency.NGN,
      },
      language: {
        type: String,
        enum: Object.values(Language),
        default: Language.EN,
      },
    },

    // Notification settings
    notifications: {
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
      marketingEmails: { type: Boolean, default: false },
      savingsAlerts: { type: Boolean, default: true },
      propertyAlerts: { type: Boolean, default: true },
      orderUpdates: { type: Boolean, default: true },
      groupChatNotifications: { type: Boolean, default: true },
    },

    // Appearance settings
    appearance: {
      theme: {
        type: String,
        enum: Object.values(Theme),
        default: Theme.LIGHT,
      },
      reducedAnimations: { type: Boolean, default: false },
      compactView: { type: Boolean, default: false },
    },

    // Security settings
    security: {
      twoFactorEnabled: { type: Boolean, default: false },
      twoFactorSecret: { type: String },
      lastPasswordChange: { type: Date },
      loginAlerts: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export const UserSettingsModel = mongoose.model("UserSettings", userSettingsSchema);