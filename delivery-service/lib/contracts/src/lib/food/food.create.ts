import { IFood } from '@delivery-service/interfaces';
import { IsNumber, IsString } from 'class-validator';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FoodCreate {
  export const topic = 'food.create.command';
  export class Request {
    @IsNumber()
    categoryId: number | undefined;
    @IsString()
    title: string | undefined;
    @IsNumber()
    price: number | undefined;
    @IsNumber()
    count: number | undefined;
    @IsNumber()
    calories: number | undefined;
    @IsNumber()
    grams: number | undefined;
    @IsNumber()
    in_stock: number | undefined;
    @IsString()
    description: string | undefined;
    // TODO: Express.Multer.File
    pictures: any | undefined;
  }
  export class Response {
    food: IFood | undefined;
  }
}
