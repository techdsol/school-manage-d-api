import { Column, Model, Table, DataType, PrimaryKey, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Student } from './student.entity';
import { ClassSection } from '../../classes/entities/class-section.entity';

@Table({
  tableName: 'student_enrollments',
  timestamps: true,
})
export class StudentEnrollment extends Model<StudentEnrollment> {
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
    type: DataType.STRING(20),
    allowNull: false,
  })
  rollNumber: string;

  @ApiProperty()
  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  enrollmentDate: Date;

  @ApiProperty({ required: false })
  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  withdrawalDate: Date;

  @ApiProperty()
  @Column({
    type: DataType.ENUM('ACTIVE', 'INACTIVE', 'TRANSFERRED', 'WITHDRAWN'),
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

  @ApiProperty()
  @Column
  createdAt: Date;

  @ApiProperty()
  @Column
  updatedAt: Date;
}
