// src/pages/SignUp.tsx
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios from "axios";

import { Card, TextInput, PasswordInput } from "../components/UI";
import { signUpSchema, type SignUpForm } from "../lib/schemas";
import { useAuth } from "../hooks/useAuth";
import { useThemeMode } from "../hooks/useThemeMode";

// Force white inputs with dark text so they are readable in dark mode
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#ffffff",
    "& fieldset": { borderColor: "#E5E7EB" },
    "&:hover fieldset": { borderColor: "#CBD5E1" },
    "&.Mui-focused fieldset": { borderColor: "#94A3B8" },
  },
  "& .MuiInputBase-input": {
    color: "#0F2742",
    "::placeholder": { color: "#64748B", opacity: 1 },
  },
  "& .MuiSvgIcon-root": { color: "#6B7280" },
} as const;

export default function SignUp() {
  const { login } = useAuth();
  const nav = useNavigate();
  const { mode } = useThemeMode();
  const isDark = mode === "dark";

  const CARD_DARK = "#142A45";
  const TEXT_DARK = "#FFFFFF";
  const SUBTEXT_DARK = "#B6C2D4";

  const [msg, setMsg] = useState<string>("");

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
    defaultValues: { name: "", email: "", password: "", confirm: "" },
  });

  const base = import.meta.env.VITE_API_URL ?? ""; // or use a Vite proxy and call "/api/..."

  const onSubmit = async (values: SignUpForm) => {
    setMsg("");
    try {
      // 1) Register
      await axios.post(`${base}/api/auth/register`, {
        username: values.name, // adjust to your backend field names
        email: values.email,
        password: values.password,
      });

      // 2) Auto-login after sign up (optional but nice UX)
      const { data } = await axios.post(`${base}/api/auth/login`, {
        usernameOrEmail: values.email,
        password: values.password,
      });

      if (data?.token) {
        localStorage.setItem("token", data.token); // if using JWT
      }

      // 3) Hydrate auth state for the app
      login({
        name: data?.username ?? values.name,
        email: values.email,
        isAdmin:
          Boolean(data?.isAdmin) ||
          (Array.isArray(data?.roles) && data.roles.includes("ADMIN")),
      });

      nav("/profile");
    } catch (err: any) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Sign up failed. Please check your inputs.";
      setMsg(String(apiMsg));
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-0px)]">
      <div className="flex items-start md:items-center justify-center px-4 pt-24 pb-16 md:pt-28">
        <Card
          elevated
          sx={{
            borderRadius: 0,
            width: "100%",
            maxWidth: 600,
            margin: "0 auto",
            backgroundColor: isDark ? CARD_DARK : "#FFFFFF",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e5e7eb"}`,
          }}
        >
          <Card.Header
            sx={{ pb: 1 }}
            title={
              <span
                className="block text-center text-4xl font-extrabold tracking-tight"
                style={{ color: isDark ? TEXT_DARK : "#1C2B39" }}
              >
                Sign Up
              </span>
            }
          />

          <Card.Content sx={{ pt: 2, pb: 6 }}>
            {msg && (
              <div
                className="mb-4 rounded-xl border px-4 py-3 text-sm"
                style={{
                  backgroundColor: isDark ? "rgba(250,204,21,0.08)" : "#fffbeb",
                  borderColor: isDark ? "rgba(250,204,21,0.25)" : "#fde68a",
                  color: isDark ? "#facc15" : "#92400e",
                }}
              >
                {msg}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
              {/* Name */}
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <div className="mx-auto w-full max-w-[400px]">
                    <TextInput
                      {...field}
                      placeholder="Full name"
                      errorText={errors.name?.message}
                      disabled={isSubmitting}
                      sx={fieldSx}
                    />
                  </div>
                )}
              />

              {/* Email */}
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <div className="mx-auto w-full max-w-[400px]">
                    <TextInput
                      {...field}
                      type="email"
                      autoComplete="email"
                      placeholder="Enter your email"
                      errorText={errors.email?.message}
                      disabled={isSubmitting}
                      sx={fieldSx}
                    />
                  </div>
                )}
              />

              {/* Password */}
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <div className="mx-auto w-full max-w-[400px]">
                    <PasswordInput
                      {...field}
                      autoComplete="new-password"
                      placeholder="Enter your password"
                      showMeter
                      errorText={errors.password?.message}
                      disabled={isSubmitting}
                      sx={fieldSx}
                    />
                  </div>
                )}
              />

              {/* Confirm Password */}
              <Controller
                name="confirm"
                control={control}
                render={({ field }) => (
                  <div className="mx-auto w-full max-w-[400px]">
                    <PasswordInput
                      {...field}
                      autoComplete="new-password"
                      placeholder="Confirm password"
                      showMeter={false}
                      errorText={errors.confirm?.message}
                      disabled={isSubmitting}
                      sx={fieldSx}
                    />
                  </div>
                )}
              />

              {/* Footer */}
              <div
                className="text-sm ml-65"
                style={{ color: isDark ? SUBTEXT_DARK : "#475569" }}
              >
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold hover:text-orange-500"
                  style={{ color: isDark ? TEXT_DARK : "#122033" }}
                >
                  Log in
                </Link>
              </div>

              {/* Submit Button */}
              <div className="pt-2 text-center">
                <button
                  className="px-9 py-3 font-bold mx-auto hover:opacity-90"
                  style={{
                    background: "#ffffff",
                    color: "#F5A623",
                    border: "2px solid #F5A623",
                  }}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Loading..." : "Sign Up"}
                </button>
              </div>

              {/* Removed: social login section (Google) */}
            </form>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
