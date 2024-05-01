import { useAppSelector } from "@/shared/store/hooks";

export const useCurrentUser = () => useAppSelector((s) => s.currentUser);

export const useShoppingCartUser = () =>
  useAppSelector((s) => s.currentUser?.shoppingCart);
