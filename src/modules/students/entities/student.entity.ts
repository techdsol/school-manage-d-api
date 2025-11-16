import { Column, Model, Table, DataType, PrimaryKey, Default, HasMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { StudentAssignment } from './student-assignment.entity';

@Table({
  tableName: 'students',
  timestamps: true,
})
export class Student extends Model<Student> {
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

  @HasMany(() => StudentAssignment, 'studentId')
  assignments: StudentAssignment[];

  @ApiProperty()
  @Column
  createdAt: Date;

  @ApiProperty()
  @Column
  updatedAt: Date;
}
