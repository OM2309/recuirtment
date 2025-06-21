"use client";

import { useState } from "react";
import { GalleryVerticalEnd, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validation/auth";
import { userExists } from "@/actions/action";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Provider = "google" | "linkedin";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState<Record<Provider, boolean>>({
    google: false,
    linkedin: false,
  });
  const [isEmailChecking, setIsEmailChecking] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleSignIn = async (provider: Provider) => {
    setIsLoading((prev) => ({ ...prev, [provider]: true }));
    try {
      await signIn(provider, { callbackUrl: "/" });
      toast.success(
        `Logged in with ${provider[0].toUpperCase() + provider.slice(1)}!`
      );
    } catch (error) {
      console.error(`${provider} login failed:`, error);
      toast.error(
        `Failed to log in with ${provider[0].toUpperCase() + provider.slice(1)}`
      );
    } finally {
      setIsLoading((prev) => ({ ...prev, [provider]: false }));
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsEmailChecking(true);
    try {
      const result = await userExists(data.email);
      console.log("Email check result:", result);

      if (!result.success) {
        toast.error("Email does not exist");
        return;
      }
      toast.success("OTP sent to your email");
      router.push("/verify-otp");
    } catch (error) {
      console.error("Error checking email:", error);
      toast.error("Something went wrong");
    } finally {
      setIsEmailChecking(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Link
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Recruitment Inc.</span>
            </Link>
            <h1 className="text-xl font-bold">Welcome to Recruitment Inc.</h1>
            <div className="text-center text-sm">
              Don`&apos`t have an account?
              <Link href="#" className="underline underline-offset-4 ml-2">
                Sign up
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isEmailChecking}
            >
              {isEmailChecking ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
          </div>

          <div className="relative text-center text-sm">
            <div className="absolute inset-0 top-1/2 border-t border-border -z-10" />
            <span className="bg-background text-muted-foreground relative px-2">
              Or
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Button
              onClick={() => handleSignIn("linkedin")}
              variant="outline"
              type="button"
              className="w-full cursor-pointer"
              disabled={isLoading.linkedin}
            >
              {isLoading.linkedin ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="mr-2 h-4 w-4"
                >
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                    fill="currentColor"
                  />
                </svg>
              )}
              LinkedIn
            </Button>
            <Button
              onClick={() => handleSignIn("google")}
              variant="outline"
              type="button"
              className="w-full cursor-pointer"
              disabled={isLoading.google}
            >
              {isLoading.google ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="mr-2 h-4 w-4"
                >
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
              )}
              Google
            </Button>
          </div>
        </div>
      </form>

      <div className="text-muted-foreground text-center text-xs text-balance">
        By clicking continue, you agree to our{" "}
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
