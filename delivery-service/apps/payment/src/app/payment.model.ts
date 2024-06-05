import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ timestamps: true })
export class Payment extends Model {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  operation_id: number;
  @Column({ type: DataType.STRING, allowNull: false })
  sha1_hash: string;
  @Column({ type: DataType.DOUBLE.UNSIGNED, allowNull: false })
  amount: number;
  @Column
  sender: number;
  @Column
  datetime: string;
}
