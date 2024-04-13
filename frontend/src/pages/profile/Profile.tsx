import { useCurrentUser } from "@/entities/user/hooks/useCurrentUser";

export const Profile = () => {
  const profile = useCurrentUser();

  return (
    <div>
      <h1>Профиль</h1>
      <h2>Логин: {profile.username}</h2>
      <h2>Имя: {profile?.name}</h2>
      <h2>email: {profile?.email}</h2>
    </div>
  );
};
