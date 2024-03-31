import {
  AllowNull,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { CreateFileDto } from './dto/file.dto';

@Table
export class File extends Model<CreateFileDto> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;
  @Column({ type: DataType.STRING, allowNull: false })
  nameWithOutExt: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, allowNull: false })
  nameWithExt: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, allowNull: false })
  extension: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, allowNull: false })
  url: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, allowNull: false })
  size: string;
}
