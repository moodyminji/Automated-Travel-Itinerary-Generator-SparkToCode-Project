// src/components/UI/Button.tsx
import MuiButton, { type ButtonProps as MuiButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Link as RouterLink } from 'react-router-dom';

export type BrandVariant = 'primary' | 'secondary' | 'subtle' | 'danger';
export type BrandSize = 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<
  MuiButtonProps,
  'variant' | 'color' | 'size' | 'href' | 'component'
> & {
  /** Brand variants mapped to MUI props */
  variant?: BrandVariant;
  size?: BrandSize;
  /** Route to navigate to (uses react-router Link) */
  to?: string;
  /** Show a small spinner and disable the button */
  isLoading?: boolean;
  /** Make button span full width */
  fullWidth?: boolean;
};

const sizeMap: Record<BrandSize, 'small' | 'medium' | 'large'> = {
  sm: 'small',
  md: 'medium',
  lg: 'large',
};

function mapVariant(v: BrandVariant = 'primary') {
  switch (v) {
    case 'secondary':
      return { muiVariant: 'outlined' as const, muiColor: 'primary' as const };
    case 'subtle':
      return { muiVariant: 'text' as const, muiColor: 'primary' as const };
    case 'danger':
      return { muiVariant: 'contained' as const, muiColor: 'error' as const };
    default:
      return { muiVariant: 'contained' as const, muiColor: 'primary' as const };
  }
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  isLoading,
  disabled,
  fullWidth,
  sx,
  ...rest
}: ButtonProps) {
  const { muiVariant, muiColor } = mapVariant(variant);

  const common: MuiButtonProps = {
    ...rest,
    variant: muiVariant,
    color: muiColor,
    size: sizeMap[size],
    disabled: isLoading || disabled,
    sx: {
      ...(fullWidth ? { width: '100%' } : null),
      textTransform: 'none',
      borderRadius: 2,
      ...sx,
    },
  };

  const content = (
    <>
      {isLoading && <CircularProgress size={18} sx={{ mr: 1.25, color: 'inherit' }} />}
      {children}
    </>
  );

  return to
    ? (
      <MuiButton {...common} component={RouterLink as any} to={to}>
        {content}
      </MuiButton>
    )
    : (
      <MuiButton {...common}>
        {content}
      </MuiButton>
    );
}
