import { IOrder } from './order.interface';
import { IShoppingCart } from './shopping-cart.interface';

export interface IUser {
  id?: number;
  displayName?: string;
  email: string;
  password: string;
  roles: UserRole;
  status: string | null;
  name: string;
  surname: string;
  username: string;
  shoppingCart?: IShoppingCart[];
  orders?: IOrder[];
}
export enum UserRole {
  seller = 1,
  buyer = 2,
}

export enum PurchaseState {
  Started = 'Started',
  WaitingForPayment = 'WaitingForPayment',
  Purchased = 'Purchased',
  Cenceled = 'Cenceled',
}

export interface IUserOrdersFood {
  id: number;
  productId: number;
  totalPrice: number;
  count: number;
  userId: number;
  purchaseState: PurchaseState | string;
}
