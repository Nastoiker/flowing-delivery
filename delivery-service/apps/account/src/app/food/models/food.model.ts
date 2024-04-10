import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Category } from '../../category/model/category.model';

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
  @Column
  price: number;
  @Column
  count: number;
  @Column
  in_stock: number;
  @Column
  description: string;
  @Column
  pictures: string;
  //   @HasMany(() => User)
  //   purchased_users?: User[];
}
