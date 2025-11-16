import { Column, Model, Table, DataType, PrimaryKey, Default, HasMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { ClassTeacherAssignment } from '../../class-sections/entities/class-teacher-assignment.entity';
import { TeacherAttendance } from './teacher-attendance.entity';

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

  @HasMany(() => ClassTeacherAssignment, 'teacherId')
  classTeacherAssignments: ClassTeacherAssignment[];

  @HasMany(() => TeacherAttendance, 'teacherId')
  attendances: TeacherAttendance[];

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;
}
