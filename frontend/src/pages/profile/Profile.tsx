import { useCurrentUser } from "@/entities/user/hooks/useCurrentUser";
import { IUser } from "@/shared/interfaces/user.interface";
import { UserDetails } from "@/widgets/AuthProfile/Profile/Profile.card";
export enum USER_ROLES {
  ADMIN = 1,
  USER = 2,
}
export const USER_ROLES_STR = {
  [USER_ROLES.ADMIN]: "Админ",
  [USER_ROLES.USER]: "Пользователь",
};
export const Profile = () => {
  const profile = useCurrentUser();

  return (
    <div>
      <UserDetails
        user={{
          ...(profile as unknown as IUser),
          roles: USER_ROLES_STR[profile.roles],
        }}
      />
    </div>
  );
};
