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
export class Rating extends Model {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;
  @ForeignKey(() => Food)
  foodId: number;
  @Column
  rating: number;
  @ForeignKey(() => User)
  userId: number;
  @BelongsTo(() => Food)
  food: Food;
  @BelongsTo(() => User)
  user: User;
}
