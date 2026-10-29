import { IFood } from './foods.interface';
import { IUser } from './user.interface';

export interface IOrder {
  id: number;
  status: string;
  allowedStatuses?: string[];
  deliveryAddress: string;
  deliveryPrice: number;
  priceFood: number;
  totalPrice: number;
  completed: boolean;
  userId: number;
  products?: IFood[];
  user?: IUser;
}
