import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Food } from '../food/models/food.model';
import { Order } from './order.model';

@Table({ timestamps: false })
export class OrderFood extends Model {
  @ForeignKey(() => Order)
  orderId: number;

  @ForeignKey(() => Food)
  foodId: number;
  @Column
  quantity: number;
}
