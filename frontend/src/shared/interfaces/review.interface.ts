import { IFood } from "./foods.interface";
import { IUser } from "./user.interface";

export interface IComment {
  id: number;
  title: string;
  description: string;
  productId: number;
  status: string;
  userId: number;
}
export interface IRating {
  id: number;
  rating: number;
  foodId: number;
  userId: number;
  user?: IUser;
}
export interface IReview {
  id: number;
  status?: number;
  title: string;
  description: string;
  rating: number;
  foodId: number;
  userId: number;
  user?: IUser;
  product?: IFood;
  createdAt?: Date;
}
