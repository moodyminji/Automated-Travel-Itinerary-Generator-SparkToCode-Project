import * as React from "react";
import { Box } from "@mui/material";

type Gap = "sm" | "md" | "lg";

const gapMap: Record<Gap, number> = { sm: 1.5, md: 2.5, lg: 3.5 };

type Props = {
  children: React.ReactNode;
  /** Number of columns at md+ breakpoint (mobile is always 1 column) */
  cols?: 2 | 3 | 4;
  gap?: Gap;
};

export function FormRow({ children, cols = 2, gap = "md" }: Props) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: gapMap[gap],
        gridTemplateColumns: {
          xs: "1fr",
          md: `repeat(${cols}, minmax(0, 1fr))`,
        },
      }}
    >
      {children}
    </Box>
  );
}
