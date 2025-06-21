import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Please enter an email")
    .email("Invalid email address"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
