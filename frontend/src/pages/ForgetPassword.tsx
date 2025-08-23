import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TextInput, Button, Card } from '../components/UI';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotSchema, type ForgotForm } from '../lib/schemas';
import apiForgot from '../services/api';
import { useThemeMode } from '../hooks/useThemeMode';

// Match SignUp field styling (readable in dark mode)
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

export default function ForgotPassword() {
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  // Dark palette to mirror SignUp page
  const CARD_DARK = '#142A45';
  const TEXT_DARK = '#FFFFFF';
  const SUBTEXT_DARK = '#B6C2D4';

  const [submitted, setSubmitted] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
    mode: 'onBlur',
    defaultValues: { email: '' },
  });

  // Slim header on this route: hide desktop nav and mobile quick-nav
  useEffect(() => {
    const header = document.querySelector<HTMLElement>('header');
    if (!header) return;

    // Desktop nav is <nav> ... ; mobile quick-nav is a div with class "md:hidden"
    const toHide: HTMLElement[] = Array.from(
      header.querySelectorAll<HTMLElement>('nav, .md\\:hidden')
    );

    const prevDisplay = toHide.map((el) => el.style.display);
    toHide.forEach((el) => {
      el.style.display = 'none';
    });

    return () => {
      toHide.forEach((el, i) => {
        el.style.display = prevDisplay[i] || '';
      });
    };
  }, []);

  useEffect(() => {
    if (!cooldown) return;
    const t = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const onSubmit = async (values: ForgotForm) => {
    try {
      await apiForgot({ data: { email: values.email } });
    } finally {
      setSubmitted(true);
      setCooldown(60);
    }
  };

  const onResend = () => {
    if (cooldown > 0) return;
    const email = getValues('email').trim();
    if (email) void onSubmit({ email });
  };

  return (
    <div className="relative min-h-[calc(100vh-0px)]">
      {/* Centered card (uses Layout background + header, only logo & toggle in navbar) */}
      <div className="flex items-start md:items-center justify-center px-4 pt-24 pb-16 md:pt-28">
        <Card
          elevated
          sx={{
            borderRadius: 0,
            width: '100%',
            maxWidth: 600,
            margin: '0 auto',
            backgroundColor: isDark ? CARD_DARK : '#FFFFFF',
          }}
        >
          <Card.Header
            sx={{ pb: 1 }}
            title={
              <span
                className="block text-center text-4xl font-extrabold tracking-tight"
                style={{ color: isDark ? TEXT_DARK : '#1C2B39' }}
              >
                Forgot Password
              </span>
            }
            subheader={
              !submitted && (
                <span
                  className="block text-center text-sm md:text-base mt-1"
                  style={{ color: isDark ? SUBTEXT_DARK : '#64748B' }}
                >
                  Enter your email and we’ll send you a reset link
                </span>
              )
            }
          />

          <Card.Content sx={{ pt: 2, pb: 6 }}>
            {!submitted ? (
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
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

                <div className="pt-2 text-center">
                  <Button
                    type="submit"
                    sx={{
                      px: '2.25rem',
                      py: '0.75rem',
                      fontWeight: 800,
                      borderRadius: 0,
                      backgroundColor: '#ffffff',
                      color: '#F5A623',
                      border: '2px solid #F5A623',
                      '&:hover': { opacity: 0.9 },
                    }}
                    isLoading={isSubmitting}
                  >
                    Send reset link
                  </Button>
                </div>

                <div
                  className="text-center text-sm"
                  style={{ color: isDark ? SUBTEXT_DARK : '#475569' }}
                >
                  Didn’t get the email?{' '}
                  <button
                    type="button"
                    className="font-semibold hover:opacity-80 disabled:opacity-50"
                    style={{ color: isDark ? TEXT_DARK : '#122033' }}
                    disabled={isSubmitting || cooldown > 0}
                    onClick={onResend}
                  >
                    {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend reset link'}
                  </button>
                </div>

                <div className="pt-2 text-center">
                  <Link
                    to="/login"
                    className="text-[18px] font-extrabold hover:underline"
                    style={{ color: isDark ? TEXT_DARK : '#0F2742' }}
                  >
                    Back to Log in
                  </Link>
                </div>
              </form>
            ) : (
              <div role="status" aria-live="polite" className="grid gap-4 mt-2">
                <p
                  className="text-center text-sm"
                  style={{ color: isDark ? SUBTEXT_DARK : '#4b5563' }}
                >
                  If an account exists for that address, we’ve sent a link to reset your password.
                  Please check your email.
                </p>

                <div className="pt-1 text-center">
                  <Link to="/login">
                    <Button
                      sx={{
                        px: '2.5rem',
                        py: '0.9rem',
                        fontWeight: 800,
                        borderRadius: 0,
                        backgroundColor: '#ffffff',
                        color: '#F5A623',
                        border: '2px solid #F5A623',
                        '&:hover': { opacity: 0.9 },
                      }}
                    >
                      Back to login
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
