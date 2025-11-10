import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Index,
} from 'sequelize-typescript';
import { ClassSection } from './class-section.entity';
import { Subject } from '../../subjects/entities/subject.entity';
import { Teacher } from '../../teachers/entities/teacher.entity';

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export enum PeriodType {
  TEACHING = 'TEACHING',
  BREAK = 'BREAK',
  LUNCH = 'LUNCH',
  ASSEMBLY = 'ASSEMBLY',
  LIBRARY = 'LIBRARY',
  SPORTS = 'SPORTS',
  EXAM = 'EXAM',
  SPECIAL = 'SPECIAL',
}

export enum TimetableStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Table({
  tableName: 'timetable',
  timestamps: true,
  indexes: [
    {
      fields: ['classSectionCode'],
      name: 'idx_timetable_class_section',
    },
    {
      fields: ['subjectCode'],
      name: 'idx_timetable_subject',
    },
    {
      fields: ['teacherId'],
      name: 'idx_timetable_teacher',
    },
    {
      fields: ['dayOfWeek'],
      name: 'idx_timetable_day',
    },
    {
      fields: ['academicYear'],
      name: 'idx_timetable_academic_year',
    },
    {
      fields: ['classSectionCode', 'dayOfWeek', 'startTime', 'academicYear'],
      name: 'idx_timetable_schedule',
    },
    {
      fields: ['teacherId', 'dayOfWeek', 'startTime', 'academicYear'],
      name: 'idx_timetable_teacher_schedule',
    },
  ],
})
export class Timetable extends Model<Timetable> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => ClassSection)
  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  classSectionCode: string;

  @BelongsTo(() => ClassSection)
  classSection: ClassSection;

  @ForeignKey(() => Subject)
  @Column({
    type: DataType.STRING(20),
    allowNull: true, // null for non-teaching periods (break, lunch, assembly, etc.)
  })
  subjectCode: string;

  @BelongsTo(() => Subject)
  subject: Subject;

  @ForeignKey(() => Teacher)
  @Column({
    type: DataType.UUID,
    allowNull: true, // null for periods without teacher or non-teaching periods
  })
  teacherId: string;

  @BelongsTo(() => Teacher)
  teacher: Teacher;

  @Column({
    type: DataType.ENUM(...Object.values(DayOfWeek)),
    allowNull: false,
  })
  dayOfWeek: DayOfWeek;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  startTime: string; // Format: "HH:mm:ss" e.g., "09:00:00"

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  endTime: string; // Format: "HH:mm:ss" e.g., "10:00:00"

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  periodNumber: number; // For ordering periods (1, 2, 3, etc.)

  @Column({
    type: DataType.ENUM(...Object.values(PeriodType)),
    allowNull: false,
    defaultValue: PeriodType.TEACHING,
  })
  periodType: PeriodType;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  academicYear: string; // e.g., "2024-2025"

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  room: string; // Room number or location

  @Column({
    type: DataType.ENUM(...Object.values(TimetableStatus)),
    allowNull: false,
    defaultValue: TimetableStatus.ACTIVE,
  })
  status: TimetableStatus;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  requiresAttendance: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;
}
