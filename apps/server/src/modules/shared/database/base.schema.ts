import { Schema } from "mongoose";

export const baseSchemaFields = {
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  }
};

export const baseSchemaOptions = {
  timestamps: true
};