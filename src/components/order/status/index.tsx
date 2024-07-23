import Chip, { ChipProps } from "@mui/material/Chip";
import { useTranslate } from "@refinedev/core";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import CheckIcon from '@mui/icons-material/Check';
import { useTheme } from "@mui/material/styles";
import { green, red, blue, grey, orange } from "@mui/material/colors";

type Props = {
  value: string; // Stato dell'ordine come stringa
  size?: ChipProps["size"];
};

const getColorAndIcon = (status: string, isDarkMode: boolean) => {
  switch (status.toUpperCase()) {
    case "OPEN":
      return {
        color: isDarkMode ? blue[200] : blue[800],
        icon: <NewReleasesIcon sx={{ fill: isDarkMode ? blue[200] : blue[600] }} />,
      };
    case "READY":
      return {
        color: "#ffa726",
        icon: <AccessAlarmIcon sx={{ fill: "#ffa726" }} />,
      };
    case "CLOSED":
      return {
        color: "#66bb6a",
        icon: <PointOfSaleIcon sx={{ fill: "#66bb6a" }} />,
      };
    case "CANCELLED":
      return {
        color: "#f44336",
        icon: <DeleteForeverIcon sx={{ fill: "#f44336" }} />,
      };
    case "FREE":
      return {
        color: "#66bb6a",
        icon: <CheckIcon sx={{ fill: "#66bb6a" }} />,
      };
    default:
      return {
        color: isDarkMode ? grey[200] : grey[800],
        icon: <AssignmentTurnedInIcon sx={{ fill: isDarkMode ? grey[200] : grey[600] }} />,
      };
  }
};

export const OrderStatus = (props: Props) => {
  const t = useTranslate();
  const { palette } = useTheme();
  const isDarkMode = palette.mode === "dark";

  const { color, icon } = getColorAndIcon(props.value, isDarkMode);

  return (
    <Chip
      label={t(`orders.status.${props.value}`)}
      icon={icon}
      variant="outlined"
      size={props?.size || "small"}
      sx={{
        borderColor: color,
        color: color,
      }}
    />
  );
};
