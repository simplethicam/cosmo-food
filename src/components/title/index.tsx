import React from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { BlackLogoSmIcon } from "../icons/black-logo-sm";
import { WhiteLogoSmIcon } from "../icons/white-logo-sm";
import { BlackLogoBgIcon } from "../icons/black-logo-bg";
import { WhiteLogoBgIcon } from "../icons/white-logo-bg";

type TitleProps = {
  collapsed: boolean;
};

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
  const theme = useTheme();
  const isLightTheme = theme.palette.mode === 'light';

  return (
    <Link to="/">
      <Box
        display="flex"
        alignItems="center"
        gap={"12px"}
        sx={{
          color: "text.primary",
        }}
      >
        {collapsed ? (
          isLightTheme ? (
            <BlackLogoSmIcon
              style={{
                height: 45,
                color: "#000",
              }}
            />
          ) : (
            <WhiteLogoSmIcon
              style={{
                height: 45,
                color: "#fff",
              }}
            />
          )
        ) : (
          isLightTheme ? (
            <BlackLogoBgIcon
              style={{
                height: 50,
                color: "#000",
              }}
            />
          ) : (
            <WhiteLogoBgIcon
              style={{
                height: 50,
                color: "#fff",
              }}
            />
          )
        )}
      </Box>
    </Link>
  );
};
