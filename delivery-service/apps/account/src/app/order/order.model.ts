import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Food } from '../food/models/food.model';
import { User } from '../user/models/user.model';
import { OrderFood } from './order-food.model';

// РЕВЬЮ DDD: это модель хранения. Правила суммы и переходов статуса
// стоит выразить в модели заказа или доменных функциях и вызывать из прикладного сценария.
@Table({ timestamps: true })
export class Order extends Model {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.STRING })
  status: string;
  @Column({ type: DataType.STRING })
  deliveryAddress: string;
  @Column({ type: DataType.DOUBLE.UNSIGNED })
  priceFood: number;
  @Column({ type: DataType.DOUBLE.UNSIGNED, allowNull: true })
  deliveryPrice: number;
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isPickUp: boolean;
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  completed: boolean;
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isPaid: boolean;
  @ForeignKey(() => User)
  userId: number;
  @Column({ type: DataType.DOUBLE.UNSIGNED })
  totalPrice: number;
  @BelongsTo(() => User)
  user: User;
  @BelongsToMany(() => Food, () => OrderFood)
  products?: Food[];
}
