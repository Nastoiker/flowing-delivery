import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Food } from '../food/models/food.model';
import { Order } from '../order/order.model';
import { User } from '../user/models/user.model';

@Table({ timestamps: true })
export class Purchase extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Food)
  @Column(DataType.INTEGER)
  foodId: number;

  @BelongsTo(() => Food)
  food: Food;

  @ForeignKey(() => Order)
  @Column(DataType.INTEGER)
  orderId: number;

  @BelongsTo(() => Order)
  order: Order;

  @Column({ type: DataType.INTEGER })
  quantity: number; // Количество купленного продукта

  @Column({ type: DataType.DOUBLE })
  totalPrice: number; // Цена за единицу
}
