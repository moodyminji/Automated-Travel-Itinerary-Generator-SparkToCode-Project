// src/pages/SignUp.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, TextInput, PasswordInput, Button } from '../components/UI';
import { signUpSchema, type SignUpForm } from '../lib/schemas';
import apiRegister from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useThemeMode } from '../hooks/useThemeMode';

const ORANGE = '#FBBF24';

// Force white inputs with dark text so they are readable in dark mode
const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
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

export default function SignUp() {
  const { login } = useAuth();
  const nav = useNavigate();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  // dark-mode palette to match the rest of the app
  const CARD_DARK = '#122033';
  const TEXT_DARK = '#DDE9F7';
  const SUBTEXT_DARK = '#B6C2D4';

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur',
    defaultValues: { name: '', email: '', password: '', confirm: '' },
  });

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
      nav('/profile');
    } catch {
      // fallback so you can keep working without backend
      login({ name: values.name, email: values.email, isAdmin: false });
      nav('/profile');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-0px)]">
      {/* Centered card (uses Layout’s background + slim header for /signup) */}
      <div className="flex items-start md:items-center justify-center px-4 pt-24 pb-16 md:pt-28">
        <Card
          elevated
          sx={{
            borderRadius: '16px',
            width: '100%',
            maxWidth: 760,
            margin: '0 auto',
            backgroundColor: isDark ? CARD_DARK : '#fff',
            boxShadow: isDark
              ? '0 20px 40px rgba(0,0,0,.45)'
              : '0 20px 40px rgba(0,0,0,.15)',
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : undefined,
          }}
        >
          <Card.Header
            sx={{ pb: 1 }}
            title={
              <span
                className="block text-center text-4xl font-extrabold tracking-tight"
                style={{ color: isDark ? TEXT_DARK : '#122033' }}
              >
                Create Account
              </span>
            }
          />

          <Card.Content sx={{ pt: 2, pb: 6 }}>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    placeholder="Full name"
                    errorText={errors.name?.message}
                    disabled={isSubmitting}
                    sx={fieldSx}
                  />
                )}
              />

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
                    sx={fieldSx}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <PasswordInput
                    {...field}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    showMeter
                    errorText={errors.password?.message}
                    disabled={isSubmitting}
                    sx={fieldSx}
                  />
                )}
              />

              <Controller
                name="confirm"
                control={control}
                render={({ field }) => (
                  <PasswordInput
                    {...field}
                    autoComplete="new-password"
                    placeholder="Confirm password"
                    showMeter={false}
                    errorText={errors.confirm?.message}
                    disabled={isSubmitting}
                    sx={fieldSx}
                  />
                )}
              />

              <div
                className="text-center text-sm"
                style={{ color: isDark ? SUBTEXT_DARK : '#475569' }}
              >
                Already have an account?{' '}
                <Link
                  to="/admin"
                  className="font-semibold hover:text-orange-500"
                  style={{ color: isDark ? TEXT_DARK : '#122033' }}
                >
                  Log in
                </Link>
              </div>

              <div className="pt-2 text-center">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  sx={{
                    px: 5,
                    backgroundColor: ORANGE,
                    color: '#1F2937',
                    fontWeight: 700,
                    '&:hover': { backgroundColor: '#f3a91b', color: '#1F2937' },
                  }}
                  isLoading={isSubmitting}
                >
                  Sign Up
                </Button>
              </div>
            </form>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
