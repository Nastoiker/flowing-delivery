import { ReactNode } from "react";
import { AppBarScroll } from "../Scrollbar/AppScrollbar";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return <AppBarScroll style={{ height: "100vh" }}>{children}</AppBarScroll>;
};
