import { Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import * as React from "react";
import { useNavigate } from "react-router-dom";

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const navigate = useNavigate();

  const isLogin = Boolean(localStorage.getItem("token"));
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        textAlign: "center",
        width: "100%",
        margin: "50px 0",
        justifyContent: "space-between",
      }}
    >
      <Button sx={{ minWidth: 100 }} onClick={() => navigate("/menu")}>
        Меню
      </Button>
      <Button sx={{ minWidth: 100 }} onClick={() => navigate("/categories")}>
        Категории
      </Button>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
        </IconButton>
      </Tooltip>
    </Box>
    //   {/* {isLogin && (
    //     // <>
    //     //   <UserSidebar />
    //     // </>
    //   )} */}
  );
}
