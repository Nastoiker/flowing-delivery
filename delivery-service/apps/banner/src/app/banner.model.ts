import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class Banner extends Model {
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
  link: string;
  @Column({ type: DataType.STRING, allowNull: false })
  picture: string;
  @Column
  priority: number;
  @Column
  alt: string;
}
