import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ timestamps: true })
export class Payment extends Model {
  @Column({
    type: DataType.STRING,
    unique: true,
    primaryKey: true,
  })
  operation_id: number;
  @Column({ type: DataType.STRING, allowNull: false })
  sha1_hash: string;
  @Column({ type: DataType.DOUBLE.UNSIGNED, allowNull: false })
  amount: number;
@Column({ type: DataType.STRING })
  sender: string;
  @Column
  datetime: string;
}
