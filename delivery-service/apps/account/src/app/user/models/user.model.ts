import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Comment } from '../../comments/comment.model';
import { LikeComment } from '../../comments/likeComment.model';
import { Order } from '../../order/order.model';
import { Purchase } from '../../purchase/purchase.model';
import { Rating } from '../../rating/rating.model';
import { ShoppingCart } from '../../shopping-cart/model/shopping-cart.model';
@Table({ timestamps: true })
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
  @Column
  status: string;
  @Column({ type: DataType.STRING, allowNull: false })
  surname: string;
  @Column({ type: DataType.STRING, allowNull: false })
  username: string;
  @Column({ type: DataType.STRING, allowNull: true })
  phone?: string;
  @Column({
    unique: true,
  })
  email: string;
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;
  @Column({ type: DataType.INTEGER, allowNull: true })
  roles: number;
  @HasMany(() => Purchase)
  purchased?: Purchase[];
  @HasMany(() => Rating)
  ratings?: Rating[];
  @HasMany(() => LikeComment)
  likeComments?: LikeComment[];
  @HasMany(() => Comment)
  comments?: Comment[];
  @HasMany(() => ShoppingCart)
  shoppingCart?: ShoppingCart[];
  @HasMany(() => Order)
  orders?: Order[];
}
