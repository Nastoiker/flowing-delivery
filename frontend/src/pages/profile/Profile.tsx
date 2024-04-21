import { useCurrentUser } from "@/entities/user/hooks/useCurrentUser";
import { IUser } from "@/shared/interfaces/user.interface";
import { UserDetails } from "@/widgets/AuthProfile/Profile/Profile.card";

export const Profile = () => {
  const profile = useCurrentUser();

  return (
    <div>
      <UserDetails user={profile as unknown as IUser} />
    </div>
  );
};
