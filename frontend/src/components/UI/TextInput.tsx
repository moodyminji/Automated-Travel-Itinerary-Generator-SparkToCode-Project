import * as React from "react";
import { TextField } from "@mui/material";
import type { ComponentProps } from "react";

type MUITextFieldProps = ComponentProps<typeof TextField>;

export type TextInputProps = Omit<MUITextFieldProps, "error" | "helperText"> & {
  errorText?: string;
  hint?: React.ReactNode;
};

export function TextInput({ errorText, hint, ...rest }: TextInputProps) {
  const hasError = Boolean(errorText);
  return (
    <TextField
      {...rest}
      error={hasError}
      helperText={hasError ? errorText : hint}
      fullWidth={rest.fullWidth ?? true}
      variant={rest.variant ?? "outlined"}
      size={rest.size ?? "medium"}
    />
  );
}
export default TextInput;

