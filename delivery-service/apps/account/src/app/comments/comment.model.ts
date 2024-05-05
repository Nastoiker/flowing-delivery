import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Food } from '../food/models/food.model';
import { User } from '../user/models/user.model';
import { LikeComment } from './likeComment.model';

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

  @ForeignKey(() => User)
  userId: number;
  @Column
  title: string;
  @Column
  status: number;
  @Column
  anonymously: boolean;
  @Column({
    type: DataType.TEXT,
  })
  description: string;
  @Column
  pictures: string;
  @BelongsTo(() => Food)
  product: Food;
  @BelongsTo(() => User)
  user: User;
  @HasMany(() => LikeComment)
  likes: LikeComment[];
}
