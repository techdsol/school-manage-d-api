import { Column, Model, Table, DataType, PrimaryKey, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { ClassType } from './class-type.entity';

@Table({
  tableName: 'classes',
  timestamps: true,
})
export class Class extends Model<Class> {
  @ApiProperty()
  @PrimaryKey
  @Column({
    type: DataType.STRING(8),
    allowNull: false,
  })
  code: string;

  @ApiProperty()
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name: string;

  @ApiProperty()
  @ForeignKey(() => ClassType)
  @Column({
    type: DataType.STRING(5),
    allowNull: false,
  })
  classTypeCode: string;

  @BelongsTo(() => ClassType, 'classTypeCode')
  classTypeDetails: ClassType;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;
}
