import { removeItem } from "@/helpers/localStorage";
import { IconButton } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { User } from "@phosphor-icons/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BasicMenuAuth({ user }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleRedirect = (url: string) => {
    handleClose();
    navigate(url);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = async (url: string) => {
    removeItem("token");
    handleRedirect(url);
  };
  return (
    <div>
      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <User />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {user?.name ? (
          <>
            <MenuItem onClick={() => handleRedirect("profile")}>
              Профиль
            </MenuItem>
            <MenuItem onClick={() => handleRedirect("admin")}>Админка</MenuItem>
            <MenuItem onClick={() => handleRedirect("orders")}>Заказы</MenuItem>
            <MenuItem onClick={() => handleRedirect("shopping-cart")}>
              Корзина
            </MenuItem>
            <MenuItem onClick={() => handleLogout("/auth/login")}>
              Выйти
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={() => handleRedirect("/auth/login")}>
              Войти
            </MenuItem>
            <MenuItem onClick={() => handleRedirect("/auth/register")}>
              Зарегистироваться
            </MenuItem>
          </>
        )}
      </Menu>
    </div>
  );
}
