import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Index,
} from 'sequelize-typescript';
import { ClassSection } from '../../classes/entities/class-section.entity';
import { Teacher } from '../../teachers/entities/teacher.entity';

export enum AssignmentRole {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
}

export enum AssignmentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Table({
  tableName: 'class_teacher_assignments',
  timestamps: true,
})
export class ClassTeacherAssignment extends Model<ClassTeacherAssignment> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Teacher)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index('idx_class_teacher_assignment_teacher')
  teacherId: string;

  @BelongsTo(() => Teacher)
  teacher: Teacher;

  @ForeignKey(() => ClassSection)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @Index('idx_class_teacher_assignment_section')
  classSectionCode: string;

  @BelongsTo(() => ClassSection)
  classSection: ClassSection;

  @Column({
    type: DataType.ENUM(...Object.values(AssignmentRole)),
    allowNull: false,
  })
  @Index('idx_class_teacher_assignment_role')
  role: AssignmentRole;

  @Column({
    type: DataType.ENUM(...Object.values(AssignmentStatus)),
    allowNull: false,
    defaultValue: AssignmentStatus.ACTIVE,
  })
  @Index('idx_class_teacher_assignment_status')
  status: AssignmentStatus;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  @Index('idx_class_teacher_assignment_start_date')
  assignmentStartDate: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  assignmentEndDate: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  updatedAt: Date;
}
