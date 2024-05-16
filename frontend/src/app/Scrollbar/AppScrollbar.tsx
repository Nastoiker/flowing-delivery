import { styled } from "@mui/material";
import SimpleBar from "simplebar-react";

export const AppBarScroll = styled(SimpleBar)`
  .simplebar-scrollbar::before {
    background-color: rgba(146, 156, 166, 0.4);
    opacity: 0.5;
  }
  width: 100%;
`;
