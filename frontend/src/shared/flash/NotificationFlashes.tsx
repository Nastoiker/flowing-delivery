import { Button } from "@mui/material";
import styled from "styled-components";
import { useAppSelector, useAppThunkDispatch } from "../store/hooks";

const StyledButton = styled(Button)`
  color: #3f3f3f;
  background: #ededff;
  font-weight: 600;
  text-transform: none;
  padding: 10px 0;
  border-radius: 0;
  box-shadow: none;

  &:hover {
    color: #ffffff;
    background: #7b61ff;
  }
`;

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  z-index: ${(props) => props.theme.variables.flashZIndex};
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  grid-row-gap: 10px;
`;

export const NotificationFlashes = () => {
  const notifications = useAppSelector((state) => state.notificationFlashes);
  // TODO: вынести логику с флешками чата в отдельный компонент
  const dialogs = useAppSelector((state) => state.chatFlashes);
  const dispatch = useAppThunkDispatch();

  // const buttonCloseClickHandler = () => {
  //   dialogs.forEach((dialog) => dispatch(removeChatFlash(dialog.uniqueId)));
  //   notifications.forEach((notification) =>
  //     dispatch(removeNotificationFlash(notification._id))
  //   );
  // };
  return <div></div>;
  // return <Container></Container>;
};
