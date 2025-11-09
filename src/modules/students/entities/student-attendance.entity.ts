import { Column, Model, Table, DataType, PrimaryKey, Default, ForeignKey, BelongsTo, Index } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { StudentAssignment } from './student-assignment.entity';
import { Teacher } from '../../teachers/entities/teacher.entity';

export enum StudentAttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EXCUSED = 'EXCUSED',
  SICK = 'SICK',
  HALF_DAY = 'HALF_DAY',
}

@Table({
  tableName: 'student_attendance',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['studentAssignmentId', 'attendanceDate'],
      name: 'unique_student_attendance_per_day',
    },
    {
      fields: ['attendanceDate'],
      name: 'idx_student_attendance_date',
    },
    {
      fields: ['status'],
      name: 'idx_student_attendance_status',
    },
  ],
})
export class StudentAttendance extends Model<StudentAttendance> {
  @ApiProperty()
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty()
  @ForeignKey(() => StudentAssignment)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  studentAssignmentId: string;

  @ApiProperty()
  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  attendanceDate: Date;

  @ApiProperty({ enum: StudentAttendanceStatus })
  @Column({
    type: DataType.ENUM(...Object.values(StudentAttendanceStatus)),
    allowNull: false,
  })
  status: StudentAttendanceStatus;

  @ApiProperty({ required: false })
  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  checkInTime: string;

  @ApiProperty({ required: false })
  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  checkOutTime: string;

  @ApiProperty({ required: false })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @ApiProperty({ required: false })
  @ForeignKey(() => Teacher)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  markedBy: string;

  @BelongsTo(() => StudentAssignment, 'studentAssignmentId')
  studentAssignment: StudentAssignment;

  @BelongsTo(() => Teacher, 'markedBy')
  teacher: Teacher;

  @ApiProperty()
  @Column
  createdAt: Date;

  @ApiProperty()
  @Column
  updatedAt: Date;
}
