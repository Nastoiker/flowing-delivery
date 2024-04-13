import { useAppSelector } from "@/shared/store/hooks";

export const useCurrentUser = () => useAppSelector((s) => s.currentUser);
