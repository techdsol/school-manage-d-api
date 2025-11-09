import { Column, Model, Table, DataType, PrimaryKey } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

@Table({
  tableName: 'subjects',
  timestamps: true,
})
export class Subject extends Model<Subject> {
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

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;
}
