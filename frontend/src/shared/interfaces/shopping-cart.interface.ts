import { IFood } from "./foods.interface";

export interface IShoppingCart {
  id: number;
  userId: number;
  purchaseState: string;
  productId: number;
  totalPrice: number;
  count: number;
  product?: IFood;
}
