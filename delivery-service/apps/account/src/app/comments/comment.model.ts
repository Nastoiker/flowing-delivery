import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Food } from '../food/models/food.model';
import { User } from '../user/models/user.model';

@Table({ timestamps: true })
export class Comment extends Model {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Food)
  productId: number;

  @ForeignKey(() => Food)
  userId: number;
  @Column
  title: string;
  @Column
  description: string;
  @Column
  pictures: string;
  @BelongsTo(() => Food)
  product: Food;
  @BelongsTo(() => User)
  user: User;
}
