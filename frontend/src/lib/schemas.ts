// src/lib/schemas.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
});
export type LoginForm = z.infer<typeof loginSchema>;

export const signUpSchema = z
  .object({
    name: z.string().min(2, "Enter your full name").max(60, "Too long"),
    email: z.string().email("Enter a valid email"),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Za-z]/, "Must include a letter")
      .regex(/[0-9]/, "Must include a number"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });
export type SignUpForm = z.infer<typeof signUpSchema>;

export const forgotSchema = z.object({
  email: z.string().email("Enter a valid email"),
});
export type ForgotForm = z.infer<typeof forgotSchema>;
