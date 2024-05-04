import {
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Category } from '../../category/model/category.model';
import { Comment } from '../../comments/comment.model';

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
  @Column({ defaultValue: 0 })
  price: number;
  @Column({ defaultValue: 0 })
  count: number;
  @Column({ defaultValue: 0 })
  calories: number;
  @Column({ defaultValue: 0 })
  grams: number;
  @Column({ defaultValue: 0 })
  in_stock: number;
  @Column
  description: string;
  @Column
  pictures: string;
  @HasMany(() => Comment)
  comments?: Comment[];
  //   @HasMany(() => User)
  //   purchased_users?: User[];
}
