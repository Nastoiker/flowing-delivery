import { IComment, IRating } from "./review.interface";

export interface IFood {
  id: number;
  categoryId: number;
  title: string;
  price: number;
  grams: number;
  calories: number;
  count: number;
  in_stock: number;
  description: string;
  pictures: string;
  ratings: IRating[];
  commnets: IComment[];
}
