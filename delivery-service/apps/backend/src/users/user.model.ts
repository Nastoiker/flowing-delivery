import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { File } from 'src/file/file.model';
import { ShoppingCart } from 'src/shopping-cart/shopping-cart.model';

@Table
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;
  @HasMany(() => File)
  files?: File[];
  @Column({ type: DataType.INTEGER, allowNull: true })
  roles?: number;

  @HasMany(() => ShoppingCart)
  shoppingCart?: ShoppingCart[];
}