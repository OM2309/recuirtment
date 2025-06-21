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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { otpSchema, OtpFormData } from "@/lib/validation/otp";

export function OtpForm({ className, ...props }: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    try {
      const result = { success: true };

      if (!result.success) {
        toast.error("Invalid OTP");
        return;
      }

      await signIn("credentials", {
        email: "user@example.com",
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
              <Label htmlFor="otp">One-Time Password</Label>
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
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
