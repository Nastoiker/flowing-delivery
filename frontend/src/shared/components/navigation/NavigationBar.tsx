import Logo from "@/assets/logo.svg";
import { useCurrentUser } from "@/entities/user/hooks/useCurrentUser";
import BasicMenuAuth from "@/widgets/AuthProfile/AuthProfile";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const navigate = useNavigate();
  const profile = useCurrentUser();
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
      <IconButton
        onClick={() => navigate("/menu")}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <img src={Logo} alt="logo" width="80px" height="80px" />
      </IconButton>
      <Button sx={{ minWidth: 100 }} onClick={() => navigate("/menu")}>
        Меню
      </Button>
      <Button sx={{ minWidth: 100 }} onClick={() => navigate("/categories")}>
        Категории
      </Button>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <BasicMenuAuth user={profile} />
      </IconButton>
    </Box>
    //   {/* {isLogin && (
    //     // <>
    //     //   <UserSidebar />
    //     // </>
    //   )} */}
  );
}
