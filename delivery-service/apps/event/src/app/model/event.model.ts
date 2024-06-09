import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ timestamps: true })
export class Event extends Model {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  message: string;
  @Column({
    type: DataType.STRING,
  })
  type: string;
  @Column
  priority: number;
}
