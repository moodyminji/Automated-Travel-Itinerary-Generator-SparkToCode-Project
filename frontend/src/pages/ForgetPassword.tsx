import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TextInput, Button } from '../components/UI';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotSchema, type ForgotForm } from '../lib/schemas';
import apiForgot from '../services/api';

// Assets
import logoUrl from '../assets/tajawalLogo.png';
import wavesDarkUrl from '../assets/waves-dark-mode.png';
import moonIcon from '../assets/Do not Disturb iOS.png';
import sunIcon from '../assets/Sun.png';
import lightBgUrl from '../assets/background.png';

const ORANGE = '#FBBF24';
const NAVY = '#0F2742';
const LIGHT_BG = '#F6E7D8';
const CARD_BG_DARK = '#17324B';
const CARD_TEXT_DARK = '#EAF2FA';
const CARD_SUBTEXT_DARK = '#B9C9D8';
const CARD_LINK_DARK = '#D7E3EE';
const CTA_TEXT_DARK = '#0F2742';

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('tajawal:theme') === 'dark';
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
    mode: 'onBlur',
    defaultValues: { email: '' },
  });

  // Hide any global navbar/header on this route
  useEffect(() => {
    const header =
      document.querySelector<HTMLElement>('[data-global-header]') ??
      document.querySelector<HTMLElement>('header');
    const prev = header?.style.display;
    if (header) header.style.display = 'none';
    return () => {
      if (header) header.style.display = prev || '';
    };
  }, []);

  // Persist theme
  useEffect(() => {
    localStorage.setItem('tajawal:theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const onSubmit = async (values: ForgotForm) => {
    try {
      await apiForgot({ data: { email: values.email } });
    } finally {
      setSubmitted(true);
    }
  };

  return (
    <div
      className="fixed inset-0 overflow-auto"
      style={{ backgroundColor: isDark ? NAVY : LIGHT_BG }}
    >
      {/* Clickable logo */}
      <Link to="/" aria-label="Go to Home" className="absolute top-3 left-3 z-20">
        <img src={logoUrl} alt="Tajawal" className="h-20 w-auto" />
      </Link>

      {/* Dark/Light toggle */}
      <button
        type="button"
        aria-label="Toggle dark mode"
        onClick={() => setIsDark((v) => !v)}
        className="absolute top-4 right-4 z-20 rounded-full p-1 hover:opacity-85"
        title="Toggle dark mode"
      >
        <img src={isDark ? sunIcon : moonIcon} alt="" className="h-6 w-6" />
      </button>

      {/* Background layer */}
      {isDark ? (
        <img
          src={wavesDarkUrl}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none fixed bottom-0 left-0 w-full h-[42vh] object-cover object-bottom z-[1]"
        />
      ) : (
        <img
          src={lightBgUrl}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none fixed inset-0 w-full h-full object-cover z-[1]"
        />
      )}

      {/* Foreground */}
      <div className="relative z-10 flex justify-center px-4 pt-24 pb-16">
        {/* >>> Replaced Card with a login-like box <<< */}
        <section
          className="w-full max-w-xl rounded-2xl shadow-xl border border-gray-100 px-8 md:px-12 py-10"
          style={{ backgroundColor: isDark ? CARD_BG_DARK : '#fff' }}
        >
          <h1
            className="text-4xl font-extrabold text-center"
            style={{ color: isDark ? CARD_TEXT_DARK : NAVY }}
          >
            Forgot Password?
          </h1>

          {!submitted ? (
            <>
              <p
                className="text-center text-[15px] mt-2"
                style={{ color: isDark ? CARD_SUBTEXT_DARK : '#4b5563' }}
              >
                Enter your email and we’ll send you a reset link
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4">
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      type="email"
                      autoComplete="email"
                      placeholder="Enter your email"
                      errorText={errors.email?.message}
                      disabled={isSubmitting}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 12,
                          backgroundColor: '#ffffff',
                        },
                        '& input': { color: isDark ? '#0F2742' : '#0F2742' },
                        '& input::placeholder': { color: isDark ? '#64748B' : undefined },
                      }}
                    />
                  )}
                />

                <div className="text-center">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    sx={{
                      px: 3,
                      py: 1,
                      minWidth: 'auto',
                      fontSize: '0.95rem',
                      borderRadius: 9999,
                      backgroundColor: ORANGE,
                      color: CTA_TEXT_DARK,
                      fontWeight: 700,
                      '&:hover': { backgroundColor: '#f3a91b' },
                    }}
                    isLoading={isSubmitting}
                  >
                    Send reset link
                  </Button>
                </div>

                <div
                  className="text-center text-sm"
                  style={{ color: isDark ? CARD_SUBTEXT_DARK : '#6b7280' }}
                >
                  Didn’t get the email?{' '}
                  <button
                    type="button"
                    className="underline hover:no-underline"
                    style={{ color: isDark ? CARD_LINK_DARK : undefined }}
                    onClick={() => {
                      const email =
                        (document.querySelector<HTMLInputElement>('input[type=email]')?.value || '').trim();
                      if (email) void onSubmit({ email });
                    }}
                  >
                    Resend reset link
                  </button>
                </div>

                <div className="pt-2 text-center">
                  <Link
                    to="/login"
                    className="text-[18px] font-extrabold hover:underline"
                    style={{ color: isDark ? CARD_TEXT_DARK : NAVY }}
                  >
                    Back to Log in
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <div role="status" aria-live="polite" className="grid gap-4 mt-4">
              <p
                className="text-center text-sm"
                style={{ color: isDark ? CARD_SUBTEXT_DARK : '#4b5563' }}
              >
                If an account exists for that address, we’ve sent a link to reset your password.
                Please check your email.
              </p>

              <div className="pt-1 text-center">
                <Link to="/login">
                  <Button
                    variant="primary"
                    size="lg"
                    sx={{
                      px: 5,
                      backgroundColor: ORANGE,
                      color: CTA_TEXT_DARK,
                      fontWeight: 700,
                      '&:hover': { backgroundColor: '#f3a91b' },
                    }}
                  >
                    Back to login
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
