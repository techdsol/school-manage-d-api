import { Column, Model, Table, DataType, PrimaryKey, ForeignKey, BelongsTo, Default } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Teacher } from '../../teachers/entities/teacher.entity';
import { Class } from './class.entity';
import { Subject } from '../../subjects/entities/subject.entity';

@Table({
  tableName: 'teacher_class_subjects',
  timestamps: true,
})
export class TeacherSpecialization extends Model<TeacherSpecialization> {
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
  @ForeignKey(() => Class)
  @Column({
    type: DataType.STRING(8),
    allowNull: false,
  })
  classCode: string;

  @ApiProperty()
  @ForeignKey(() => Subject)
  @Column({
    type: DataType.STRING(8),
    allowNull: false,
  })
  subjectCode: string;

  @ApiProperty({ required: false })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @BelongsTo(() => Teacher, 'teacherId')
  teacher: Teacher;

  @BelongsTo(() => Class, 'classCode')
  class: Class;

  @BelongsTo(() => Subject, 'subjectCode')
  subject: Subject;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;
}
