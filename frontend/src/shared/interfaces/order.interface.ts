import { IFood } from "./foods.interface";
import { IUser } from "./user.interface";

export interface IOrder {
  id: number;
  status: string;
  allowedStatuses?: string[];
  completed: boolean;
  deliveryAddress: string;
  deliveryPrice: number;
  priceFood: number;
  totalPrice: number;
  userId: number;
  isPickUp: boolean;
  products?: IFood[];
  user?: IUser;
}
