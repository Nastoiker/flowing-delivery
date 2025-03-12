import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Category } from '../../category/model/category.model';
import { Comment } from '../../comments/comment.model';
import { Rating } from '../../rating/rating.model';

@Table({ timestamps: true })
export class Food extends Model {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Category)
  categoryId: number;
  @Column
  title: string;
  @Column({ type: DataType.DOUBLE.UNSIGNED, defaultValue: 0 })
  price: number;
  @Column({ defaultValue: 0, type: DataType.INTEGER.UNSIGNED })
  count: number;
  @Column({ defaultValue: 0, type: DataType.INTEGER.UNSIGNED })
  calories: number;
  @Column({ defaultValue: 0, type: DataType.DOUBLE.UNSIGNED })
  grams: number;
  @Column({ defaultValue: 0 })
  in_stock: number;
  @Column
  description: string;
  @Column
  pictures: string;
  @BelongsTo(() => Category, { onDelete: 'CASCADE' })
  category?: Category;
  @HasMany(() => Comment)
  comments?: Comment[];
  @HasMany(() => Rating)
  ratings?: Rating[];
  //   @HasMany(() => User)
  //   purchased_users?: User[];
}
