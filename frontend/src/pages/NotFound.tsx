import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import type { Theme } from "@mui/material";

export default function NotFound() {
  const theme: Theme = useTheme();
  const isDark: boolean = theme.palette.mode === "dark";

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div
        className="w-full max-w-3xl flex flex-col items-center py-10 px-8 mx-auto shadow-lg"
        style={{ backgroundColor: isDark ? "#0B1D33" : "#FFFFFF" }}
      >
        <h1
          className="text-6xl font-extrabold font-poppins"
          style={{ color: theme.palette.text.primary }}
        >
          404
        </h1>

        <h2
          className="text-2xl font-bold font-poppins mt-2"
          style={{ color: theme.palette.text.primary }}
        >
          Oops! Page Not Found
        </h2>

        <p
          className="max-w-md mx-auto text-center font-poppins mt-4"
          style={{ color: theme.palette.text.secondary }}
        >
          We couldn’t find the page you’re looking for. It might have been moved,
          deleted, or typed incorrectly.
        </p>

        <div className="flex gap-4 justify-center mt-8">
          <Link
            to="/"
            className="px-6 py-2 font-semibold text-white"
            style={{ backgroundColor: "#F5A623" }}
          >
            Back Home
          </Link>
          <Link
            to="/profile"
            className="px-6 py-2 font-semibold"
            style={{
              backgroundColor: isDark ? "#FFFFFF" : "#1D3557",
              color: isDark ? "#F5A623" : "#FFFFFF",
              border: isDark ? "2px solid #F5A623" : "none",
            }}
          >
            Go to My Trips
          </Link>
        </div>
      </div>
    </div>
  );
}
