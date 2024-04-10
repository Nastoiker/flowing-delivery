import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Food } from '../../food/models/food.model';
import { User } from '../../user/models/user.model';

@Table({ timestamps: true })
export class ShoppingCart extends Model {
  @Column({ primaryKey: true })
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
}
