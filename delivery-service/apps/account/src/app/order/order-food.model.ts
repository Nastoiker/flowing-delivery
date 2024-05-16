import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Food } from '../food/models/food.model';
import { Order } from './order.model';

@Table({ timestamps: false })
export class OrderFood extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Order)
  orderId: number;

  @ForeignKey(() => Food)
  foodId: number;
}
