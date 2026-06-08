import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../../config/env";

interface TokenPayload extends JwtPayload {
  userId: string;
}

export class JwtService {

  static signAccessToken(userId: string): string {
    return jwt.sign(
      { userId },
      env.JWT_SECRET,
      {
        expiresIn: "15m"
      }
    );
  }

  static signRefreshToken(userId: string): string {
    return jwt.sign(
      { userId },
      env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d"
      }
    );
  }

  static verifyAccessToken(token: string): TokenPayload {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    // Check if decoded is a string (shouldn't happen with proper tokens)
    if (typeof decoded === 'string') {
      throw new Error('Invalid token format');
    }
    return decoded as TokenPayload;
  }

  static verifyRefreshToken(token: string): TokenPayload {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
    // Check if decoded is a string (shouldn't happen with proper tokens)
    if (typeof decoded === 'string') {
      throw new Error('Invalid token format');
    }
    return decoded as TokenPayload;
  }
}