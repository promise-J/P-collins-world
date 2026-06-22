import { Types } from "mongoose";

/**
 * Safely converts a string to a Mongoose ObjectId.
 * Returns null if the string is invalid or empty.
 */
export const toMongooseObjectId = (id: string | undefined | null): Types.ObjectId | null => {
  if (!id || !Types.ObjectId.isValid(id)) {
    return null;
  }
  return new Types.ObjectId(id);
};
