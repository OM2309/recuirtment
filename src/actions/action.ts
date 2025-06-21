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
    console.log("Generated OTP:", otpNumber);

    await prisma.otp.create({
      data: {
        otp: otpNumber,
        userId: user.id,
      },
    });

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
      data: user,
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
