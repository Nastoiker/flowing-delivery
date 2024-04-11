import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Food } from '../../food/models/food.model';

@Table
export class Category extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;
  @Column({ type: DataType.STRING, allowNull: false })
  slug: string;
  @ForeignKey(() => Category)
  @Column
  parentId: number;

  @BelongsTo(() => Category, { foreignKey: 'parentId', onDelete: 'SET NULL' })
  parent: Category;

  @HasMany(() => Category, 'parentId')
  subcategories: Category[];

  @HasMany(() => Food)
  products: Food[];
}
