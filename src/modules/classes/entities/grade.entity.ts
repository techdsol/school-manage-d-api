import { Column, Model, Table, DataType, PrimaryKey } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

@Table({
  tableName: 'grades',
  timestamps: true,
})
export class Grade extends Model<Grade> {
  @ApiProperty()
  @PrimaryKey
  @Column({
    type: DataType.STRING(10),
    allowNull: false,
  })
  code: string;

  @ApiProperty()
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  name: string;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;
}
