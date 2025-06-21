"use server";

import prisma from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/sendEmail";

export async function userExists(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return {
        success: false,
        data: null,
        message: "User with this email does not exist",
      };
    }

    const otpNumber = Math.floor(100000 + Math.random() * 900000).toString();

    const otp = await prisma.otp.create({
      data: {
        otp: otpNumber,
        userId: user.id,
      },
    });

    console.log("OTP created:", otp);

    const emailSent = await sendOtpEmail(user.email, otpNumber);

    if (!emailSent) {
      return {
        success: false,
        data: null,
        message: "Failed to send OTP email",
      };
    }

    return {
      success: true,
      data: otp,
      message: "OTP sent successfully to your email",
    };
  } catch (error) {
    console.error("Error in userExists:", error);

    return {
      success: false,
      data: null,
      message: error || "An unexpected error occurred",
    };
  }
}

export async function verifyOtp(userId: number, otp: string, id: number) {
  try {
    const otpRecord = await prisma.otp.findUnique({
      where: { id: id },
    });

    if (!otpRecord) {
      return {
        success: false,
        message: "Invalid OTP",
      };
    }

    await prisma.otp.delete({ where: { id } });

    return {
      success: true,
      message: "OTP verified successfully",
    };
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    return {
      success: false,
      message: error || "An unexpected error occurred",
    };
  }
}
