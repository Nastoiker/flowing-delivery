import { useCurrentUser } from "@/entities/user/hooks/useCurrentUser";
import { HOST } from "@/helpers/api";
import { getItem } from "@/helpers/localStorage";
import { Drawer, IconButton, Typography } from "@mui/material";
import { Bell } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import io from "socket.io-client";
import styled from "styled-components";
interface Props {
  //   isOpenNavigationDrawer: boolean;
  //   onToggleNavigationDrawer: () => void;
  //   onCloseNavigationDrawer: () => void;
}
const Container = styled.div<{ $isShowPmBlock: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 50px;
  gap: 50px;
  transition: width 0.3s ease-in;
  height: 100%;
  padding-bottom: ${({ $isShowPmBlock }) => ($isShowPmBlock ? "172px" : "0px")};

  @media screen and (max-width: 640px) {
    width: 100%;
  }
`;
const StyledBasketDiv = styled.div`
  background: white;
  border-radius: 50px;
  width: 15px;
  height: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  color: #4c7c7d;
  right: 2px;
  font-size: 10px;
`;
export const NotifyDrawer = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any>([]);
  const currentUser = useCurrentUser();
  const [readed, setReaded] = useState<number>(0);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  const handleClickNotify = () => {
    setReaded(0);
    setOpen(true);
  };
  useEffect(() => {
    const socket = io(HOST, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      withCredentials: true,
      query: {
        token: getItem("token"), // Передача токена как параметра запроса
      },
      // withCredentials: true,
    });
    socket.on("newNotification", (notification) => {
      toast(notification);
      setReaded((v) => v + 1);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        notification,
      ]);
    });
    socket.on("connect", function () {
      console.log("Connected");
    });
    return () => {
      socket.disconnect();
    };
  }, [currentUser]);
  return (
    <>
      <IconButton sx={{ position: "relative" }} onClick={handleClickNotify}>
        <Bell size={"30px"} />
        {notifications?.length > 0 && readed > 0 && (
          <StyledBasketDiv>{notifications?.length}</StyledBasketDiv>
        )}
      </IconButton>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <Container $isShowPmBlock={false}>
          {notifications?.length > 0 ? (
            <div>
              {notifications.map((notification, index) => (
                <p key={index}>{notification}</p>
              ))}
            </div>
          ) : (
            <Typography margin="20px 0" variant="h5">
              Уведомлений нету
            </Typography>
          )}
        </Container>
      </Drawer>
    </>
  );
};
