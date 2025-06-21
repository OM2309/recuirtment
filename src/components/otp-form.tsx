"use client";

import { useState } from "react";
import { Loader2, GalleryVerticalEnd } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { otpSchema, OtpFormData } from "@/lib/validation/otp";
import useOtpStore from "@/store/useOtpStore";
import { verifyOtp } from "@/actions";
import { signIn } from "next-auth/react";
import useEmailStore from "@/store/useEmailStore";

export function OtpForm({ className, ...props }: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const getOtp = useOtpStore((state) => state.otpData);
  const getEmail = useEmailStore((state) => state.email);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const onSubmit = async (data: OtpFormData) => {
    console.log("OTP Form Data:", data);
    setIsLoading(true);

    if (!getOtp?.userId || !getOtp?.id) {
      toast.error("OTP session has expired. Please try again.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await verifyOtp(getOtp.userId, data.otp, getOtp.id);

      if (!result.success) {
        toast.error("Invalid OTP");
        return;
      }

      await signIn("credentials", {
        email: getEmail,
        redirect: true,
        callbackUrl: "/",
      });

      toast.success("Logged in successfully!");
    } catch (error) {
      console.error("OTP verification failed:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Recruitment Inc.</span>
            </Link>
            <h1 className="text-xl font-bold">Verify Your Email</h1>
            <div className="text-center text-sm">
              Enter the 6-digit code sent to your email.
              <Link href="/login" className="underline underline-offset-4 ml-2">
                Change email
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-6 items-center">
            <div className="grid gap-3">
              <InputOTP
                maxLength={6}
                onChange={(value) => setValue("otp", value)}
                {...register("otp")}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              {errors.otp && (
                <p className="text-red-500 text-sm">{errors.otp.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Verify OTP"
              )}
            </Button>
          </div>
        </div>
      </form>

      <div className="text-muted-foreground text-center text-xs text-balance">
        By continuing, you agree to our{" "}
        <Link
          href="#"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="#"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
}
