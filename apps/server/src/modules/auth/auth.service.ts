import bcrypt from "bcryptjs";
import crypto from "crypto";
import { AuthRepository } from "./auth.repository";
import { JwtService } from "../services/jwt.service";
import { serviceResponse } from "@/utils/apiResponse";
import { UserModel } from "../users/user.model";
import {
  welcomeEmail,
  verificationEmail,
  passwordResetEmail,
} from "../email/email.templates";
import { firebaseAdmin } from "@/config/firebase-admin.config";
import { emailAction } from "../email/email-action.service";
import { UserRole } from "@/enum/role.enum";
import { WalletModel } from "../wallet/wallet.model";

export class AuthService {
  private repository = new AuthRepository();

  async register(data: any) {
    const existingUser = await this.repository.findByEmail(data.email);

    if (existingUser) {
      return serviceResponse(false, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 60 * 15 * 1000);

    const role = data.role || UserRole.USER;

    const user = await this.repository.createUser({
      ...data,
      password: hashedPassword,
      verificationToken,
      verificationExpires,
      role,
      verifiedAgent: role === UserRole.AGENT ? false : undefined,
      verifiedLandlord: role === UserRole.LANDLORD ? false : undefined,
    });

    // await WalletModel.create({
    //   userId: user._id,
    //   balance: 0,
    //   pendingBalance: 0,
    // });

    const verificationLink = `${process.env.WEB_URL}/verify-email/${verificationToken}`;

    await emailAction({
      action: "sendVerificationEmail",
      options: {
        to: user.email,
        subject: "Verify Your Email",
        html: verificationEmail(verificationLink, user.firstName),
      },
    });

    return serviceResponse(
      true,
      "Registration successful. Please verify your email.",
      user
    );
  }

  async login(email: string, password: string, role: string) {
    if (!password) {
      return serviceResponse(false, "Invalid credentials");
    }
    if (!role) {
      return serviceResponse(false, "Please provide a role");
    }

    const user = await this.repository.findByEmail(email);

    if (!user) {
      return serviceResponse(false, "You are not registered");
    }

    if (user?.role !== role) {
      return serviceResponse(false, "Account for this role does not exists");
    }

    if (!user.isVerified) {
      return serviceResponse(
        false,
        "Please verify your email before logging in"
      );
    }

    if (user.isSuspended) {
      return serviceResponse(
        false,
        `Account suspended. Reason: ${
          user.suspensionReason || "Violation of terms"
        }`
      );
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return serviceResponse(false, "Invalid credentials");
    }

    const accessToken = JwtService.signAccessToken(user._id.toString());
    const refreshToken = JwtService.signRefreshToken(user._id.toString());

    await this.repository.updateRefreshToken(user._id.toString(), refreshToken);

    const userObj = user.toObject();

    const {
      password: _,
      refreshToken: __,
      verificationToken,
      verificationExpires,
      passwordResetToken,
      passwordResetExpires,
      ...userData
    } = userObj as any;

    return serviceResponse(true, "Login successful", {
      user: userData,
      accessToken,
      refreshToken,
    });
  }

  async googleAuth(data: {
    firebaseId: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    idToken: string;
    role?: string;
    businessName?: string;
  }) {
    try {
      const decodedToken = await firebaseAdmin
        .auth()
        .verifyIdToken(data.idToken);

      if (decodedToken.uid !== data.firebaseId) {
        return serviceResponse(false, "Invalid token");
      }

      let user = await this.repository.findByFirebaseId(data.firebaseId);
      let isNewUser = false;

      if (!user) {
        user = await this.repository.findByEmail(data.email);

        if (user) {
          user = await this.repository.updateFirebaseId(
            user._id.toString(),
            data.firebaseId
          );
        }
      }

      if (!user) {
        const role = data.role || UserRole.USER;

        user = await this.repository.createUser({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          avatar: data.avatar,
          firebaseId: data.firebaseId,
          isVerified: true,
          role: role,
          businessName: data.businessName,
          password: Math.random().toString(36),
          verifiedAgent: role === UserRole.AGENT ? false : undefined,
          verifiedLandlord: role === UserRole.LANDLORD ? false : undefined,
        });
        isNewUser = true;
      } else {
        const requestedRole = data.role || UserRole.USER;
        const userRole = user.role || UserRole.USER;

        if (userRole !== requestedRole) {
          return serviceResponse(
            false,
            `This account is registered as ${userRole}. Please sign in as ${userRole}.`,
            {
              userRole: userRole,
              requestedRole: requestedRole,
              mismatch: true,
            }
          );
        }
      }

      const accessToken = JwtService.signAccessToken(user._id.toString());
      const refreshToken = JwtService.signRefreshToken(user._id.toString());

      await this.repository.updateRefreshToken(
        user._id.toString(),
        refreshToken
      );

      const userData = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        businessName: user.businessName,
        isVerified: user.isVerified,
        verifiedAgent: user.verifiedAgent,
        verifiedLandlord: user.verifiedLandlord,
      };

      if (isNewUser) {
        await emailAction({
          action: "welcomeEmail",
          options: {
            to: userData.email,
            subject: "Welcome to P Collins",
            html: welcomeEmail(userData.firstName, userData.role),
          },
        });
      }

      return serviceResponse(true, "Google login successful", {
        user: userData,
        accessToken,
        refreshToken,
        isNewUser,
      });
    } catch (error) {
      console.error("Google auth error:", error);
      return serviceResponse(false, "Google authentication failed");
    }
  }

  async refresh(refreshToken: string) {
    try {
      const payload = JwtService.verifyRefreshToken(refreshToken);
      const accessToken = JwtService.signAccessToken(payload.userId);
      const newRefresh = JwtService.signRefreshToken(payload.userId);

      // Update refresh token in database
      await this.repository.updateRefreshToken(payload.userId, newRefresh);

      return serviceResponse(true, "Token refreshed", {
        accessToken,
        refreshToken: newRefresh,
      });
    } catch (error) {
      return serviceResponse(false, "Invalid or expired refresh token");
    }
  }

  async verifyEmail(token: string) {
    const user = await UserModel.findOne({
      verificationToken: token,
      verificationExpires: { $gt: new Date() },
    });

    if (!user) {
      return serviceResponse(false, "Invalid or expired verification token");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    await emailAction({
      action: "welcomeEmail",
      options: {
        to: user.email,
        subject: "Welcome to P Collins",
        html: welcomeEmail(user.firstName, user.role),
      },
    });

    return serviceResponse(true, "Email verified successfully");
  }

  async forgotPassword(email: string) {
    const user = await this.repository.findByEmail(email);

    if (!user) {
      return serviceResponse(
        true,
        "If your email is registered, you will receive a reset link"
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 1 * 60 * 15 * 1000);

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await user.save();

    const resetLink = `${
      process.env.WEB_URL || "http://localhost:5173"
    }/reset-password/${resetToken}`;

    await emailAction({
      action: "forgotPasswordEmail",
      options: {
        to: user.email,
        subject: "Password Reset Request - P Collins",
        html: passwordResetEmail(resetLink, user.firstName),
      },
    });

    return serviceResponse(
      true,
      "If your email is registered, you will receive a reset link"
    );
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await UserModel.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return serviceResponse(false, "Invalid or expired reset token");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return serviceResponse(true, "Password reset successfully");
  }

  async resendVerification(email: string) {
    const user = await this.repository.findByEmail(email);

    if (!user) {
      return serviceResponse(false, "User not found");
    }

    if (user.isVerified) {
      return serviceResponse(false, "Email already verified");
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 60 * 15 * 1000);

    user.verificationToken = verificationToken;
    user.verificationExpires = verificationExpires;
    await user.save();

    const verificationLink = `${process.env.WEB_URL}/verify-email/${verificationToken}`;

    await emailAction({
      action: "resendVerificationEmail",
      options: {
        to: user.email,
        subject: "Verify Your Email",
        html: verificationEmail(verificationLink, user.firstName),
      },
    });

    return serviceResponse(true, "Verification email resent");
  }

  async logout(userId: string) {
    await this.repository.updateRefreshToken(userId, "");
    return serviceResponse(true, "Logout successful");
  }
}
