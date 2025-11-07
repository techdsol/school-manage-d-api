import { Column, Model, Table, DataType, PrimaryKey, Default, HasMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Class } from './class.entity';

@Table({
  tableName: 'class_types',
  timestamps: true,
})
export class ClassType extends Model<ClassType> {
  @ApiProperty()
  @PrimaryKey
  @Column({
    type: DataType.STRING(5),
    allowNull: false,
  })
  code: string;

  @ApiProperty()
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  type: string;

  @HasMany(() => Class)
  classes: Class[];

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;
}
