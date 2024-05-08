// import { Avatar, Box, Button, Dialog } from "@material-ui/core";
// import Divider from "@material-ui/core/Divider";
// import Paper from "@material-ui/core/Paper";
// import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
// import { NavLink } from "react-router-dom";
// import styled, { css } from "styled-components";
// import { overflowText } from "utils/css";
// import StyledButton from "./StyledButton";
// import { StyledTextField } from "./StyledTextField";

// export { StyledButton, StyledTextField };

// export const UserAvatar = styled(Avatar)`
//   height: 128px;
//   width: 128px;
//   background-color: transparent;
//   border: 2px solid rgba(0, 0, 0, 0.06);
// `;

// export const CircleButton = styled(Button)`
//   border-radius: 90px;
//   padding: 0;
//   min-width: 24px;
//   height: 24px;
//   /* TODO убрать, когда добавиться функционал с лобавлением картинки.
//   Сделано чтобы перекрыть стили disabled */
//   color: #ffffff !important;
//   background: #0066ff !important;
//   box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
// `;

// export const StyledDialog = styled(Dialog)`
//   z-index: ${(props) => props.theme.variables.modalZIndex} !important;
// `;

// export const BoxPRO = styled(Box)`
//   color: white;
//   background-color: #56ca00;
//   padding: 8px 10px;
//   border-radius: 8px;
//   font-weight: 600;
//   white-space: nowrap;
// `;

// export const StyledPaper = styled(Paper)`
//   box-shadow: 0 15px 130px rgba(0, 0, 0, 0.1);
//   max-width: 480px;
//   min-width: 320px;
//   width: 100%;
// `;

// export const PointerArea = styled.div`
//   display: flex;
//   align-items: center;
//   cursor: pointer;
//   opacity: 0.8;
//   gap: 16px;

//   :hover,
//   :focus {
//     opacity: 1;
//   }
// `;

// export const AvatarWrapper = styled.div`
//   position: relative;
// `;

// export const NameContainer = styled.div`
//   max-width: 225px;
//   @media (max-width: 959px) {
//     display: none;
//     margin: 0;
//   }
// `;

// export const StyledAvatar = styled(Avatar)`
//   width: 40px;
//   height: 40px;
//   font-size: 1.8rem;
//   @media (max-width: 959px) {
//     width: 32px;
//     height: 32px;
//     font-size: 1.5rem;
//   }
// `;

// export const TypographyName = styled.p`
//   ${overflowText};
//   font-family: Montserrat, sans-serif;
//   font-style: normal;
//   font-weight: 500;
//   font-size: 14px;
//   line-height: 17px;
//   color: #000000;
// `;

// export const TypographyOrgName = styled.p`
//   ${overflowText};
//   font-family: Montserrat, sans-serif;
//   font-style: normal;
//   font-weight: 500;
//   font-size: 12px;
//   line-height: 15px;
//   color: #656565;
// `;

// export const textStyle = css`
//   font-family: Montserrat, sans-serif;
//   font-style: normal;
// `;

// export const StyledDivider = styled(Divider)`
//   background: #ededed;
//   flex-grow: 1;
// `;

// export const UserNameText = styled.span`
//   ${textStyle};
//   font-weight: 600;
//   font-size: 24px;
//   line-height: 133.4%;
//   color: #0f0f0f;
//   margin-right: 16px;
//   max-width: 300px;
//   ${overflowText};
// `;

// export const UserRoleText = styled.span`
//   ${textStyle};
//   font-weight: 500;
//   font-size: 13px;
//   line-height: 16px;
//   color: rgba(15, 15, 15, 0.4);
// `;

// export const SectionNameText = styled.span`
//   ${textStyle};
//   font-weight: 500;
//   font-size: 18px;
//   line-height: 19px;
//   letter-spacing: 0.15px;
//   color: #0f0f0f;
// `;

// export const LinkText = styled(NavLink)`
//   ${textStyle};
//   font-weight: 500;
//   font-size: 14px;
//   line-height: 143%;
//   letter-spacing: 0.15px;
//   color: #0f0f0f;
//   text-decoration: none;
//   outline: 0;
//   opacity: 0.8;
//   :hover,
//   :focus {
//     color: #0f0f0f;
//     text-decoration: none;
//     outline: 0;
//     opacity: 1;
//   }
// `;

// export const StyledNotificationsIcon = styled(NotificationsNoneIcon)`
//   margin-right: 16px;
// `;

// export const UserInfoForm = styled.form`
//   width: 100%;
// `;
