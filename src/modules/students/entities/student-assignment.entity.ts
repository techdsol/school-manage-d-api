import { Column, Model, Table, DataType, PrimaryKey, Default, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Student } from './student.entity';
import { ClassSection } from '../../classes/entities/class-section.entity';
import { Attendance } from './attendance.entity';

@Table({
  tableName: 'student_assignments',
  timestamps: true,
})
export class StudentAssignment extends Model<StudentAssignment> {
  @ApiProperty()
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty()
  @ForeignKey(() => Student)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  studentId: string;

  @ApiProperty()
  @ForeignKey(() => ClassSection)
  @Column({
    type: DataType.STRING(8),
    allowNull: false,
  })
  classSectionCode: string;



  @ApiProperty()
  @Column({
    type: DataType.ENUM('ACTIVE', 'INACTIVE'),
    allowNull: false,
    defaultValue: 'ACTIVE',
  })
  status: string;

  @ApiProperty({ required: false })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @BelongsTo(() => Student, 'studentId')
  student: Student;

  @BelongsTo(() => ClassSection, 'classSectionCode')
  classSection: ClassSection;

  @HasMany(() => Attendance, 'studentAssignmentId')
  attendances: Attendance[];

  @ApiProperty()
  @Column
  createdAt: Date;

  @ApiProperty()
  @Column
  updatedAt: Date;
}
