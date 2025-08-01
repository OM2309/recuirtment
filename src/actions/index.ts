"use server";

import prisma from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/sendEmail";
import { google } from "googleapis";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import extractEmailBody from "@/lib/extractEmailBody";

export async function userExists(email: string) {
  const emailString = Array.isArray(email) ? email[0] : email;

  try {
    const user = await prisma.user.findUnique({
      where: { email: emailString },
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
        userId: user?.id,
      },
    });

    const emailSent = await sendOtpEmail(user?.email, otpNumber);

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

export async function fetchApplicationResumes() {
  try {
    const session = await auth();

    const accessToken = session?.user?.accessToken || session?.accessToken;

    if (!session || !accessToken) {
      throw new Error("Unauthorized: No access token found in session");
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.AUTH_GOOGLE_ID,
      process.env.AUTH_GOOGLE_SECRET
    );

    oauth2Client.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // Fetch latest 10 emails
    const res = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
      q: "",
    });

    const messages = res.data.messages;

    if (!messages || messages.length === 0) {
      console.log("No emails found");
      return [];
    }

    // Fetch full message details for each message
    const detailedMessages = await Promise.all(
      messages.map(async (msg) => {
        const message = await gmail.users.messages.get({
          userId: "me",
          id: msg.id!,
        });

        const headers = message.data.payload?.headers || [];
        const fromHeader = headers.find((h) => h.name === "From")?.value || "";

        // Extract email and name from "From" header
        const emailMatch = fromHeader.match(/<(.+?)>/);
        const senderEmail = emailMatch ? emailMatch[1] : fromHeader;
        // Extract name by removing the email part and trimming
        const senderName = emailMatch
          ? fromHeader.replace(/<(.+?)>/, "").trim()
          : fromHeader;

        return {
          message,
          senderProfile: {
            name: senderName || senderEmail,
            email: senderEmail,
          },
        };
      })
    );

    const emails = detailedMessages.map(({ message, senderProfile }) => {
      const headers = message.data.payload?.headers || [];
      const subject = headers.find((h) => h.name === "Subject")?.value || "";
      const from = headers.find((h) => h.name === "From")?.value || "";

      return {
        id: message.data.id,
        snippet: message.data.snippet,
        subject,
        from,
        senderProfile: {
          name: senderProfile.name,
          email: senderProfile.email,
        },
      };
    });

    return emails;
  } catch (error: any) {
    if (error.code === 403 && error.status === "PERMISSION_DENIED") {
      console.error("Access denied: App not verified or user not authorized.");
      throw new Error(
        "Access denied: Please contact the developer to add your email as a test user or verify the app with Google."
      );
    }
    console.error("Error fetching application resumes:", error);
    throw new Error("Failed to fetch application resumes");
  }
}

export async function fetchEmailDetails(emailId: string) {
  try {
    console.log(`Fetching details for email ID: ${emailId}`);
    const session = await auth();

    const accessToken = session?.user?.accessToken || session?.accessToken;

    if (!session || !accessToken) {
      throw new Error("Unauthorized: No access token found in session");
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.AUTH_GOOGLE_ID,
      process.env.AUTH_GOOGLE_SECRET
    );

    oauth2Client.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // Fetch the full email with format: "full"
    const response = await gmail.users.messages.get({
      userId: "me",
      id: emailId,
      format: "full",
    });

    const message = response.data;

    // Extract headers
    const headers = message.payload?.headers || [];
    const subject =
      headers.find((h) => h.name === "Subject")?.value || "No subject";
    const from =
      headers.find((h) => h.name === "From")?.value || "Unknown sender";
    const cc =
      headers.find((h) => h.name === "Cc")?.value || "No CC recipients";

    // Extract sender name and email from "From" header
    const emailMatch = from.match(/<(.+?)>/);
    const senderEmail = emailMatch ? emailMatch[1] : from;
    const senderName = emailMatch ? from.replace(/<(.+?)>/, "").trim() : from;

    // Extract body
    const body = extractEmailBody(message.payload);

    // Return formatted email details
    const emailDetails = {
      id: message.id,
      subject,
      from,
      cc,
      body,
      senderProfile: {
        name: senderName || senderEmail || "Unknown",
        email: senderEmail || "No email",
      },
    };

    return emailDetails;
  } catch (error: any) {
    if (error.code === 403 && error.status === "PERMISSION_DENIED") {
      console.error(
        "Access denied: App not verified or user not authorized.",
        error
      );
      throw new Error(
        "Access denied: Please contact the developer to add your email as a test user or verify the app with Google."
      );
    }
    console.error(`Error fetching email details for ID ${emailId}:`, error);
    throw new Error("Failed to fetch email details");
  }
}
