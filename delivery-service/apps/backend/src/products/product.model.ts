import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
  } from 'sequelize-typescript';
  import { Category } from 'src/categories/category.model';
  
  @Table({ timestamps: true })
  export class Product extends Model {
    @Column({
      type: DataType.INTEGER,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    })
    id: number;
  
    @ForeignKey(() => Category)
    @Column({ type: DataType.INTEGER, onDelete: 'SET NULL' })
    categoryId: number;
  
    @Column({ type: DataType.STRING, allowNull: false })
    sku: string;
  
    @Column({ type: DataType.STRING, allowNull: false })
    name: string;
  
    @Column({ type: DataType.TEXT, allowNull: false })
    description: string;
  
    @Column({ type: DataType.FLOAT, allowNull: false })
    price: number;
  
    @Column({ type: DataType.INTEGER, allowNull: false })
    status: number;
  }