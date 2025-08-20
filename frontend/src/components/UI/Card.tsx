import * as React from "react";
import {
  Card as MUICard,
  CardContent as MUICardContent,
  CardHeader as MUICardHeader,
  CardActions as MUICardFooter,
  Typography,
} from "@mui/material";

type RootProps = React.ComponentProps<typeof MUICard> & {
  elevated?: boolean;
};

function Root({ children, elevated = true, sx, ...rest }: RootProps) {
  return (
    <MUICard
      elevation={elevated ? 3 : 0}
      sx={{ borderRadius: 3, ...sx }}
      {...rest}
    >
      {children}
    </MUICard>
  );
}

type HeaderProps = React.ComponentProps<typeof MUICardHeader> & {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
};

function Header({ title, subtitle, ...rest }: HeaderProps) {
  return (
    <MUICardHeader
      title={
        typeof title === "string" ? (
          <Typography variant="h6" component="h1">
            {title}
          </Typography>
        ) : (
          title
        )
      }
      subheader={subtitle}
      {...rest}
    />
  );
}

const Content = MUICardContent;
const Footer = MUICardFooter;

export const Card = Object.assign(Root, {
  Header,
  Content,
  Footer,
});
