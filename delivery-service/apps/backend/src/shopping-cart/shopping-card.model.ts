import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Product } from '../products/product.model';
import { User } from '../users/user.model';


@Table({ timestamps: true })
export class ShoppingCart extends Model {
  @Column({ primaryKey: true })
  id: number;
  @ForeignKey(() => User)
  @Column
  userId: number;
  @ForeignKey(() => Product)
  @Column({ defaultValue: 0 })
  productId: number;

  @Column
  boiler_manufacturer: string;

  @Column({ defaultValue: 0 })
  price: number;

  @Column
  parts_manufacturer: string;

  @Column
  name: string;
  @ForeignKey(() => File)
  @Column
  image: string;

  @Column({ defaultValue: 0 })
  in_stock: number;

  @Column({ defaultValue: 1 })
  count: number;

  @Column({ defaultValue: 0 })
  total_price: number;
}