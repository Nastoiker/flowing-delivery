import { USER_ROLES } from "@/pages/profile/Profile";
import {
  Bag,
  DotsNine,
  House,
  IconProps,
  User,
  Wrench,
} from "@phosphor-icons/react";

export type MenuItemType = {
  title: string;
  options: string[];
  allowedRoles: (string | USER_ROLES)[];
  link: string;
  isUrl?: boolean;
  Icon: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;
};
const MENU_ITEMS = [
  {
    title: "Главная",
    link: "/menu",
    Icon: House,
  },
  {
    title: "Категории",
    link: "/categories",
    Icon: DotsNine,
  },
  {
    title: "Админка",
    allowedRoles: [USER_ROLES.ADMIN],
    link: "/admin",
    Icon: Wrench,
  },
  {
    title: "Профиль",
    allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.USER],
    link: "/profile",
    Icon: User,
  },
  {
    title: "Корзина",
    allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.USER],
    link: "/shopping-cart",
    Icon: Bag,
  },
];
export const getMenuListByUserRole = (role_id: number) =>
  MENU_ITEMS.filter(({ allowedRoles }) =>
    allowedRoles ? allowedRoles.includes(role_id) : true
  );
