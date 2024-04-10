import { IFood } from './foods.interface';

export interface ICategory {
  name: string;
  slug: string;
  parentId?: number;
  parent?: ICategory;
  subcategories?: ICategory[];
  products?: IFood[];
}
