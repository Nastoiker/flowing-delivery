import { IFood } from './foods.interface';
import { IUser } from './user.interface';

export interface IComment {
  id: number;
  title: string;
  description: string;
  productId: number;
  userId: number;
  user?: IUser;
  product?: IFood;
}
