import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export const NavigationSideBarItem = ({ title, link, Icon, onClick }) => {
  return (
    <Link to={link} onClick={onClick}>
      <Box display="flex" gap="10px" alignItems={"center"}>
        <Typography>{title}</Typography>
        <Icon />
      </Box>
    </Link>
  );
};
