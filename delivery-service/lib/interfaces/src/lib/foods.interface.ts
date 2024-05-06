import { IComment } from './comment.interface';
import { IRating } from './rating.interface';

export interface IFood {
  id: number;
  categoryId: number;
  title: string;
  price: number;
  count: number;
  in_stock: number;
  grams: number;
  calories: number;
  description: string;
  pictures: string;
  rating?: IRating[];
  comments?: IComment[];
}
