import { Link } from "react-router-dom";
import Box from "@mui/material/Box";

import { CosmofoodsLogoIcon } from "../icons/cosmofoods-logo";
import { CosmofoodsLogoSmIcon } from "../icons/cosmofoods-logo-sm";

type TitleProps = {
  collapsed: boolean;
};

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
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
          <CosmofoodsLogoSmIcon
            style={{
              height: 45,
              color: "#fff",
            }} />
        ) : (
            <CosmofoodsLogoIcon
              style={{
                height: 50,
                color: "#fff",
              }} />
        )}
      </Box>
    </Link>
  );
};
