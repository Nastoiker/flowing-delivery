import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Food } from '../food/models/food.model';

@Table({ timestamps: true })
export class Order extends Model {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.DATE })
  orderDate: Date;

  @Column({ type: DataType.STRING })
  status: string;

  @Column({ type: DataType.DOUBLE })
  total: number;

  @HasMany(() => Food)
  items?: Food[]; // Предположим, что заказ может включать элементы Food

  @Column({ type: DataType.INTEGER })
  userId: number; // Внешний ключ для связи с User
}
