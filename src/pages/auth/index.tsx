import * as React from "react";
import { AuthPage as MUIAuthPage, AuthProps } from "@refinedev/mui";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import {
  CosmofoodsLogoIcon,
} from "../../components/icons/cosmofoods-logo";

const authWrapperProps = {
  style: {
    background:
      "linear-gradient(rgba(0, 0, 0, .9), rgba(0, 0, 0, .5)), url(images/login-bg-grey.jpg)",
    backgroundSize: "cover",
  },
};

const renderAuthContent = (content: React.ReactNode) => {
  return (
    <div>
      <Link to="/">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap="12px"
          marginBottom="16px"
        >
          <CosmofoodsLogoIcon
            style={{
              height: 90,
              color: "#fff",
            }}
          />
        </Box>
      </Link>
      {content}
    </div>
  );
};

export const AuthPage: React.FC<AuthProps> = ({ type, formProps }) => {
  return (
    <MUIAuthPage
      type={type}
      wrapperProps={authWrapperProps}
      renderContent={renderAuthContent}
      formProps={formProps}
    />
  );
};
