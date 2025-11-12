import { Column, Model, Table, DataType, PrimaryKey, Default, ForeignKey, BelongsTo, Index } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Student } from './student.entity';
import { Teacher } from '../../teachers/entities/teacher.entity';
import { Timetable } from '../../timetable/entities/timetable.entity';

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
      fields: ['timetableId', 'studentId'],
      name: 'unique_student_attendance_per_timetable',
    },
    {
      fields: ['studentId', 'attendanceDate'],
      name: 'idx_student_attendance_student_date',
    },
    {
      fields: ['attendanceDate'],
      name: 'idx_student_attendance_date',
    },
    {
      fields: ['status'],
      name: 'idx_student_attendance_status',
    },
    {
      fields: ['timetableId'],
      name: 'idx_student_attendance_timetable',
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
  @ForeignKey(() => Timetable)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  timetableId: string;

  @ApiProperty()
  @ForeignKey(() => Student)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  studentId: string;

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

  @BelongsTo(() => Timetable, 'timetableId')
  timetable: Timetable;

  @BelongsTo(() => Student, 'studentId')
  student: Student;

  @BelongsTo(() => Teacher, 'markedBy')
  teacher: Teacher;

  @ApiProperty()
  @Column
  createdAt: Date;

  @ApiProperty()
  @Column
  updatedAt: Date;
}
