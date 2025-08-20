import * as React from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  LinearProgress,
  Typography,
  Box,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import type { TextFieldProps } from "@mui/material/TextField";

/** Base is TextField props; we add our extras */
export type PasswordInputProps = Omit<TextFieldProps, "type" | "error" | "helperText"> & {
  errorText?: string;
  hint?: React.ReactNode;
  /** show/hide strength meter */
  showMeter?: boolean;
};

/** tiny helper to estimate password strength */
function getStrength(pw: string) {
  const hasLen = pw.length >= 10 ? 2 : pw.length >= 8 ? 1 : 0;
  const hasLetter = /[A-Za-z]/.test(pw) ? 1 : 0;
  const hasNumber = /[0-9]/.test(pw) ? 1 : 0;
  const hasSymbol = /[^A-Za-z0-9]/.test(pw) ? 1 : 0;
  const variety = hasLetter + hasNumber + hasSymbol; // 0..3
  const score = Math.max(0, Math.min(3, hasLen + variety)); // 0..3
  const labels = ["Weak", "Medium", "Strong", "Very Strong"] as const;
  const percent = [25, 50, 75, 100][score];
  return { label: labels[score], percent };
}

export function PasswordInput({
  errorText,
  hint,
  showMeter = true,
  value,
  defaultValue,
  onChange,
  autoComplete = "new-password",
  ...rest
}: PasswordInputProps) {
  const [show, setShow] = React.useState(false);

  // compute strength from controlled or default value (best-effort)
  const current = (value ?? defaultValue ?? "") as string;
  const strength = getStrength(current);

  return (
    <Box>
      <TextField
        {...rest}
        type={show ? "text" : "password"}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        autoComplete={autoComplete}
        error={Boolean(errorText)}
        helperText={errorText ? errorText : hint}
        fullWidth={rest.fullWidth ?? true}
        InputProps={{
          ...(rest.InputProps ?? {}),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={show ? "Hide password" : "Show password"}
                onClick={() => setShow((s) => !s)}
                edge="end"
              >
                {show ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {showMeter && (
        <Box sx={{ mt: 1.5 }}>
          <LinearProgress
            variant="determinate"
            value={current ? strength.percent : 0}
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Typography variant="caption" sx={{ display: "inline-block", mt: 0.5, opacity: 0.8 }}>
            {current ? `Password strength: ${strength.label}` : "Enter a password"}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
