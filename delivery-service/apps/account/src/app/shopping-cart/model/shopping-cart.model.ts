import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Food } from '../../food/models/food.model';
import { User } from '../../user/models/user.model';

@Table({ timestamps: true })
export class ShoppingCart extends Model {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;
  @ForeignKey(() => User)
  @Column
  userId: number;
  @Column
  purchaseState: string;
  @ForeignKey(() => Food)
  @Column({ defaultValue: 0 })
  productId: number;

  @Column({ defaultValue: 0 })
  totalPrice: number;

  @Column({ defaultValue: 1 })
  count: number;
  @BelongsTo(() => Food)
  product: Food;
  @BelongsTo(() => User)
  user: User;
}
