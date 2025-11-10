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
import { ClassSection } from './class-section.entity';
import { Subject } from '../../subjects/entities/subject.entity';
import { Teacher } from '../../teachers/entities/teacher.entity';

export enum ClassSubjectStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Table({
  tableName: 'class_subjects',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['classSectionCode', 'subjectCode'],
      name: 'unique_class_section_subject',
    },
    {
      fields: ['classSectionCode'],
      name: 'idx_class_subject_section',
    },
    {
      fields: ['subjectCode'],
      name: 'idx_class_subject_subject',
    },
    {
      fields: ['teacherId'],
      name: 'idx_class_subject_teacher',
    },
    {
      fields: ['status'],
      name: 'idx_class_subject_status',
    },
  ],
})
export class ClassSubject extends Model<ClassSubject> {
  @ApiProperty()
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty()
  @ForeignKey(() => ClassSection)
  @Index('idx_class_subject_section')
  @Column({
    type: DataType.STRING(10),
    allowNull: false,
  })
  classSectionCode: string;

  @ApiProperty()
  @ForeignKey(() => Subject)
  @Index('idx_class_subject_subject')
  @Column({
    type: DataType.STRING(10),
    allowNull: false,
  })
  subjectCode: string;

  @ApiProperty({ required: false })
  @ForeignKey(() => Teacher)
  @Index('idx_class_subject_teacher')
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  teacherId: string;

  @ApiProperty({ enum: ClassSubjectStatus })
  @Index('idx_class_subject_status')
  @Column({
    type: DataType.ENUM(...Object.values(ClassSubjectStatus)),
    allowNull: false,
    defaultValue: ClassSubjectStatus.ACTIVE,
  })
  status: ClassSubjectStatus;

  @ApiProperty({ required: false })
  @Column(DataType.TEXT)
  notes: string;

  @BelongsTo(() => ClassSection, 'classSectionCode')
  classSection: ClassSection;

  @BelongsTo(() => Subject, 'subjectCode')
  subject: Subject;

  @BelongsTo(() => Teacher, 'teacherId')
  teacher: Teacher;

  @ApiProperty()
  @Column
  createdAt: Date;

  @ApiProperty()
  @Column
  updatedAt: Date;
}
