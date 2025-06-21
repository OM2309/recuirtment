import * as z from "zod";

export const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});
export type OtpFormData = z.infer<typeof otpSchema>;
