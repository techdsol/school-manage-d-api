import { Column, Model, Table, DataType, PrimaryKey, Default } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

@Table({
  tableName: 'teachers',
  timestamps: true,
})
export class Teacher extends Model<Teacher> {
  @ApiProperty()
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty()
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name: string;

  @ApiProperty()
  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  phone: string;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;
}
