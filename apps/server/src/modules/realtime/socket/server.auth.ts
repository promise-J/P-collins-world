import jwt from "jsonwebtoken";

export const verifySocketToken = (token: string) => {
  try {
    return jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as any;
  } catch (err) {
    return null;
  }
};