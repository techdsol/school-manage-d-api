import { Column, Model, Table, DataType, PrimaryKey, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Class } from './class.entity';
import { AcademicYear } from '../../academic-years/entities/academic-year.entity';
import { StudentAssignment } from '../../students/entities/student-assignment.entity';
import { ClassTeacherAssignment } from '../../class-sections/entities/class-teacher-assignment.entity';

@Table({
  tableName: 'class_sections',
  timestamps: true,
})
export class ClassSection extends Model<ClassSection> {
  @ApiProperty()
  @PrimaryKey
  @Column({
    type: DataType.STRING(8),
    allowNull: false,
  })
  code: string;

  @ApiProperty()
  @ForeignKey(() => Class)
  @Column({
    type: DataType.STRING(8),
    allowNull: false,
  })
  classCode: string;

  @ApiProperty({ required: false })
  @Column({
    type: DataType.STRING(10),
    allowNull: true,
  })
  section: string;

  @ApiProperty()
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name: string;

  @ApiProperty()
  @ForeignKey(() => AcademicYear)
  @Column({
    type: DataType.STRING(8),
    allowNull: false,
  })
  academicYearCode: string;

  @BelongsTo(() => Class, 'classCode')
  classDetails: Class;

  @BelongsTo(() => AcademicYear, 'academicYearCode')
  academicYear: AcademicYear;

  @HasMany(() => StudentAssignment, 'classSectionCode')
  assignments: StudentAssignment[];

  @HasMany(() => ClassTeacherAssignment, 'classSectionCode')
  teacherAssignments: ClassTeacherAssignment[];

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;
}
