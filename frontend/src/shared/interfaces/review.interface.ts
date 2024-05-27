import { IUser } from "./user.interface";

export interface IComment {
  id: number;
  title: string;
  description: string;
  productId: number;
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
  title: string;
  description: string;
  rating: number;
  foodId: number;
  userId: number;
  user?: IUser;
  createdAt?: Date;
}
