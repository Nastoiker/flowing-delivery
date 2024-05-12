import { SearchContext } from "@/app/Context/SearchContext";
import { getMenuListByUserRole } from "@/app/Menu/menu.constants";
import { useWindowSize } from "@/app/hooks/useWindowSize";
import Logo from "@/assets/logo.svg";
import { useCurrentUser } from "@/entities/user/hooks/useCurrentUser";
import { SearchField } from "@/shared/search/SearchField";
import BasicMenuAuth from "@/widgets/AuthProfile/AuthProfile";
import {
  AppBar,
  Button,
  Slide,
  Toolbar,
  useScrollTrigger,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationDrawer } from "./NavigationDrawer";

const ScrollToHide = ({ children, window = false, threshold }) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: threshold,
    //TODO
    //@ts-ignore
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={true} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};
export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const { matches960 } = useWindowSize();

  const navigate = useNavigate();
  const profile = useCurrentUser();
  const { setSearch, search } = useContext(SearchContext);
  const menuItems = useMemo(
    () => getMenuListByUserRole(profile?.roles),
    [profile]
  );
  return (
    <ScrollToHide threshold={0}>
      <AppBar color="secondary" position="sticky">
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          {!matches960 && (
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
          )}

          {!matches960 ? (
            <>
              <Button sx={{ minWidth: 100 }} onClick={() => navigate("/menu")}>
                Меню
              </Button>
              <Button
                sx={{ minWidth: 100 }}
                onClick={() => navigate("/categories")}
              >
                Категории
              </Button>
            </>
          ) : (
            <NavigationDrawer menuItems={menuItems} />
          )}

          <div style={{ maxWidth: "300px" }}>
            <SearchField
              onEnter={() => navigate("/menu/search")}
              value={search}
              size="small"
              onChange={(value) => {
                setSearch(value);
              }}
            />
          </div>
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
        </Toolbar>
      </AppBar>
    </ScrollToHide>

    //   {/* {isLogin && (
    //     // <>
    //     //   <UserSidebar />
    //     // </>
    //   )} */}
  );
}
