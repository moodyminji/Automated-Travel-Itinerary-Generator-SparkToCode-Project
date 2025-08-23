// src/pages/SignUp.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, TextInput, PasswordInput } from '../components/UI';
import { signUpSchema, type SignUpForm } from '../lib/schemas';
import apiRegister from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useThemeMode } from '../hooks/useThemeMode';
import { useState } from 'react';

// Force white inputs with dark text so they are readable in dark mode
const fieldSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#ffffff',
    '& fieldset': { borderColor: '#E5E7EB' },
    '&:hover fieldset': { borderColor: '#CBD5E1' },
    '&.Mui-focused fieldset': { borderColor: '#94A3B8' },
  },
  '& .MuiInputBase-input': {
    color: '#0F2742',
    '::placeholder': { color: '#64748B', opacity: 1 },
  },
  '& .MuiSvgIcon-root': { color: '#6B7280' },
} as const;

function GoogleIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 533.5 544.3" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M533.5 278.4c0-18.4-1.5-36.8-4.7-54.8H272v103.9h147.5c-6.3 34.5-25.5 63.8-54.4 83.3v68h87.7c51.4-47.4 80.7-117.4 80.7-200.4z"
      />
      <path
        fill="#34A853"
        d="M272 544.3c73.6 0 135.4-24.4 180.5-66.1l-87.7-68c-24.4 16.4-55.7 26.2-92.8 26.2-71.2 0-131.5-48.1-153-112.9H28.1v70.8c45.3 89.7 137.3 150 243.9 150z"
      />
      <path
        fill="#FBBC05"
        d="M119 323.5c-10.9-32.5-10.9-67.5 0-100l-90.9-70.8c-39.9 79.7-39.9 172 0 251.7l90.9-70.9z"
      />
      <path
        fill="#EA4335"
        d="M272 107.7c39.9 0 75.9 13.7 104.2 40.5l78-78C407.4 24.4 345.6 0 272 0 165.4 0 73.4 60.3 28.1 150.9l90.9 70.8c21.5-64.8 81.8-113.9 153-113.9z"
      />
    </svg>
  );
}

export default function SignUp() {
  const { login } = useAuth();
  const nav = useNavigate();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  // dark-mode palette to match the rest of the app
  const CARD_DARK = '#142A45';
  const TEXT_DARK = '#FFFFFF';
  const SUBTEXT_DARK = '#B6C2D4';

  // NEW: simple verification modal state
  const [showVerify, setShowVerify] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [pendingNavData, setPendingNavData] = useState<{ name: string; email: string } | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur',
    defaultValues: { name: '', email: '', password: '', confirm: '' },
  });

  async function handleVerify() {
    // Minimal client-side check; replace with real API verification if available
    if (verifyCode.trim().length < 4) {
      setVerifyError('Please enter the 4–6 digit code we sent to your email.');
      return;
    }
    // After "verification", proceed to profile
    setVerifyError(null);
    setShowVerify(false);
    nav('/profile');
  }

  const onSubmit = async (values: SignUpForm) => {
    try {
      const res = await apiRegister('/register', {
        method: 'POST',
        data: {
          name: values.name,
          email: values.email,
          password: values.password,
        },
      });
      login({
        name: res?.data?.user?.name ?? values.name,
        email: res?.data?.user?.email ?? values.email,
        isAdmin: false,
      });
      // NEW: open verification modal instead of navigating immediately
      setPendingNavData({ name: values.name, email: values.email });
      setShowVerify(true);
    } catch {
      // fallback so you can keep working without backend
      login({ name: values.name, email: values.email, isAdmin: false });
      // NEW: open verification modal in fallback as well
      setPendingNavData({ name: values.name, email: values.email });
      setShowVerify(true);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-0px)]">
      {/* Centered card (uses Layout’s background + slim header for /signup) */}
      <div className="flex items-start md:items-center justify-center px-4 pt-24 pb-16 md:pt-28">
        <Card
          elevated
          sx={{
            borderRadius: 0,
            width: '100%',
            maxWidth: 600,
            margin: '0 auto',
            backgroundColor: isDark ? CARD_DARK : '#FFFFFF',
            // >>> Only change: border color matching Login <<<
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb'}`,
          }}
        >
          <Card.Header
            sx={{ pb: 1 }}
            title={
              <span
                className="block text-center text-4xl font-extrabold tracking-tight"
                style={{ color: isDark ? TEXT_DARK : '#1C2B39' }}
              >
                Sign Up
              </span>
            }
          />

          <Card.Content sx={{ pt: 2, pb: 6 }}>
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
                style={{ color: isDark ? SUBTEXT_DARK : '#475569' }}
              >
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold hover:text-orange-500"
                  style={{ color: isDark ? TEXT_DARK : '#122033' }}
                >
                  Log in
                </Link>
              </div>

              {/* Submit Button */}
              <div className="pt-2 text-center">
                <button
                  className="px-9 py-3 font-bold mx-auto hover:opacity-90"
                  style={{
                    background: '#ffffff',
                    color: '#F5A623',
                    border: '2px solid #F5A623',
                  }}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Loading...' : 'Sign Up'}
                </button>
              </div>

              <div className="flex items-center gap-3 my-7 justify-center">
                <div
                  className="h-px w-30"
                  style={{ backgroundColor: isDark ? "rgba(255,255,255,0.12)" : "#e5e7eb" }}
                />
                <p
                  className="text-sm font-semibold whitespace-nowrap"
                  style={{ color: isDark ? SUBTEXT_DARK : "#64748b" }}
                >
                  Or sign up with
                </p>
                <div
                  className="h-px w-30"
                  style={{ backgroundColor: isDark ? "rgba(255,255,255,0.12)" : "#e5e7eb" }}
                />
              </div>

              {/* Social login buttons — Google only */}
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  className="p-2 rounded transition-colors"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? "#1f3555" : "#f3f4f6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? "#142A45" : "#ffffff";
                  }}
                >
                  <GoogleIcon className="w-9 h-9" />
                </button>
              </div>
            </form>
          </Card.Content>
        </Card>
      </div>

      {/* === NEW: Verification Modal === */}
      {showVerify && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/50" />
          {/* modal */}
          <div
            className="relative w-full max-w-md rounded-2xl p-6 shadow-xl"
            style={{
              backgroundColor: isDark ? CARD_DARK : '#ffffff',
              color: isDark ? TEXT_DARK : '#111827',
            }}
          >
            <h2 className="text-xl font-bold mb-2">Verify your email</h2>
            <p className="text-sm mb-4" style={{ color: isDark ? SUBTEXT_DARK : '#475569' }}>
              {pendingNavData?.email
                ? `We’ve sent a verification code to ${pendingNavData.email}.`
                : 'We’ve sent a verification code to your email.'}
            </p>

            <label className="text-sm font-semibold mb-1 block">
              Enter verification code
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="4–6 digits"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.replace(/[^\d]/g, ''))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none"
              style={{
                backgroundColor: '#ffffff',
                color: '#0f172a',
                borderColor: verifyError ? '#EF4444' : '#d1d5db',
              }}
            />

            {verifyError && (
              <p className="mt-2 text-sm" style={{ color: '#EF4444' }}>
                {verifyError}
              </p>
            )}

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded-lg"
                onClick={() => {
                  setShowVerify(false);
                  setVerifyError(null);
                  setVerifyCode('');
                }}
                style={{
                  backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6',
                  color: isDark ? TEXT_DARK : '#111827',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg font-semibold"
                onClick={handleVerify}
                style={{
                  backgroundColor: '#F5A623',
                  color: '#1F2937',
                }}
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
