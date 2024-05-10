import { Drawer, IconButton } from "@mui/material";
import { List } from "@phosphor-icons/react";
import { useState } from "react";
import styled from "styled-components";
import { NavigationSideBarItem } from "./NavigationSideBarItem";

interface Props {
  //   isOpenNavigationDrawer: boolean;
  //   onToggleNavigationDrawer: () => void;
  //   onCloseNavigationDrawer: () => void;
  menuItems: any;
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
export const NavigationDrawer = ({
  //   isOpenNavigationDrawer,
  //   onToggleNavigationDrawer,
  //   onCloseNavigationDrawer,
  menuItems,
}: Props) => {
  const [open, setOpen] = useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  return (
    <>
      <IconButton onClick={toggleDrawer(true)}>
        <List />
      </IconButton>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <Container $isShowPmBlock={false}>
          {menuItems?.map(({ title, link, Icon, ...rest }) => (
            <NavigationSideBarItem
              key={title}
              title={title}
              link={link}
              Icon={Icon}
              {...rest}
              onClick={toggleDrawer(false)}
            />
          ))}
        </Container>
      </Drawer>
    </>
  );
};
