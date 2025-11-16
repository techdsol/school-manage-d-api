import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  Index,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Teacher } from './teacher.entity';

export enum TeacherAttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  HALF_DAY = 'HALF_DAY',
  ON_LEAVE = 'ON_LEAVE',
  SICK_LEAVE = 'SICK_LEAVE',
  CASUAL_LEAVE = 'CASUAL_LEAVE',
}

@Table({
  tableName: 'teacher_attendance',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['teacherId', 'attendanceDate'],
      name: 'unique_teacher_attendance_per_day',
    },
    {
      fields: ['attendanceDate'],
      name: 'idx_teacher_attendance_date',
    },
    {
      fields: ['status'],
      name: 'idx_teacher_attendance_status',
    },
  ],
})
export class TeacherAttendance extends Model<TeacherAttendance> {
  @ApiProperty()
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty()
  @ForeignKey(() => Teacher)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  teacherId: string;

  @ApiProperty()
  @Index('idx_teacher_attendance_date')
  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  attendanceDate: Date;

  @ApiProperty({ enum: TeacherAttendanceStatus })
  @Index('idx_teacher_attendance_status')
  @Column({
    type: DataType.ENUM(...Object.values(TeacherAttendanceStatus)),
    allowNull: false,
  })
  status: TeacherAttendanceStatus;

  @ApiProperty({ required: false })
  @Column(DataType.TIME)
  checkInTime: string;

  @ApiProperty({ required: false })
  @Column(DataType.TIME)
  checkOutTime: string;

  @ApiProperty({ required: false })
  @Column(DataType.TEXT)
  notes: string;

  @ApiProperty({ required: false })
  @Column(DataType.UUID)
  markedBy: string;

  @BelongsTo(() => Teacher, 'teacherId')
  teacher: Teacher;

  @ApiProperty()
  @Column
  createdAt: Date;

  @ApiProperty()
  @Column
  updatedAt: Date;
}
