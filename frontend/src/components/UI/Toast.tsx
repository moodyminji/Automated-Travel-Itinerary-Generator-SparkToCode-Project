import { Snackbar, Alert } from "@mui/material";
import type { AlertColor } from "@mui/material/Alert";

export type ToastProps = {
  open: boolean;
  message: string;
  severity?: AlertColor; // 'success' | 'info' | 'warning' | 'error'
  onClose: () => void;
  /** ms; default 3000 */
  duration?: number;
};

export function Toast({
  open,
  message,
  severity = "success",
  onClose,
  duration = 3000,
}: ToastProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={(_, reason) => {
        // ignore clickaway so the user can click inside the toast without closing it
        if (reason !== "clickaway") onClose();
      }}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
