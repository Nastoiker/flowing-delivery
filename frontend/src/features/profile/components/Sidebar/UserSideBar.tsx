// import { Drawer } from "@material-ui/core";
// import Badge from "@material-ui/core/Badge";
// import { PROFILE_PIC_PATH } from "constants/imagePaths";
// import { useCurrentUser } from "hooks/useCurrentUser";
// import { useModalState } from "hooks/useModal";
// import { useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { userLogout } from "store/actions/user";
// import { useAppThunkDispatch } from "store/hooks";
// import RightMenu from "./RightMenu";
// import {
//   AvatarWrapper,
//   NameContainer,
//   PointerArea,
//   StyledAvatar,
//   StyledPaper,
//   TypographyName,
// } from "./styled";

// const UserSidebar = () => {
//   const currentUser = useCurrentUser();
//   const { email_confirmed, Profile } = currentUser;

//   const { isOpen, onToggle, onClose } = useModalState();

//   const dispatch = useAppThunkDispatch();
//   const navigate = useNavigate();

//   const handleExit = useCallback(() => {
//     dispatch(userLogout());
//     navigate("/signin");
//   }, []);

//   const userName = Profile?.PublicInfo?.shortName || Profile?.name || "";

//   return (
//     <>
//       <PointerArea onClick={onToggle}>
//         <AvatarWrapper>
//           <Badge
//             overlap="circular"
//             color="error"
//             invisible={email_confirmed}
//             anchorOrigin={{
//               vertical: "bottom",
//               horizontal: "right",
//             }}
//             badgeContent="!"
//           >
//             <StyledAvatar
//               src={`${PROFILE_PIC_PATH}/${Profile?.imageFileName || ""}`}
//             >
//               {userName.slice(0, 2)}
//             </StyledAvatar>
//           </Badge>
//         </AvatarWrapper>
//         <NameContainer>
//           {Profile.lastname || Profile.firstname ? (
//             <TypographyName>
//               {[Profile.lastname, Profile.firstname].filter(Boolean).join(" ")}
//             </TypographyName>
//           ) : null}
//         </NameContainer>
//       </PointerArea>
//       <Drawer
//         PaperProps={{
//           component: StyledPaper,
//         }}
//         anchor="right"
//         variant="temporary"
//         open={isOpen}
//         onClose={onClose}
//       >
//         <RightMenu handleExit={handleExit} onClose={onClose} />
//       </Drawer>
//     </>
//   );
// };

// export default UserSidebar;
