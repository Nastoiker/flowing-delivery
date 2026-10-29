import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Food } from '../food/models/food.model';
import { Order } from './order.model';

@Table({ timestamps: false })
export class OrderFood extends Model {
  @ForeignKey(() => Order)
  orderId: number;

  @ForeignKey(() => Food)
  foodId: number;
  @Column
  quantity: number;

  // Nullable only for historical rows whose original price/title cannot be reconstructed.
  @Column({ type: DataType.STRING, allowNull: true })
  productTitle: string | null;

  @Column({ type: DataType.BIGINT, allowNull: true })
  unitPriceMinor: string | null;
}
