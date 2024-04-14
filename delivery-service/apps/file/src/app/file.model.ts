import { AllowNull, Column, Model, Table } from 'sequelize-typescript';

@Table
export class File extends Model {
  @AllowNull(false)
  @Column
  nameWithOutExt: string;

  @AllowNull(false)
  @Column
  nameWithExt: string;

  @AllowNull(false)
  @Column
  extension: string;

  @AllowNull(false)
  @Column
  url: string;

  @AllowNull(false)
  @Column
  size: string;

  @AllowNull(false)
  @Column
  creatorId: number;

  @Column
  documentTypeId: number;

  // если добавляете сущность - убедитесь, что она  включена в проверку при получении файла
  //   @HasMany(() => Users_Files)
  //   users_Files: Users_Files[];
}
