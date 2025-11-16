import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  HasMany,
  BeforeValidate,
} from 'sequelize-typescript';
import { FeeStructure } from './fee-structure.entity';
import { Student } from '../../students/entities/student.entity';

export enum TransactionStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

@Table({
  tableName: 'fee_transactions',
  timestamps: true,
  paranoid: true,
})
export class FeeTransaction extends Model<FeeTransaction> {
  @PrimaryKey
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  code: string;

  @ForeignKey(() => Student)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  studentId: string;

  @ForeignKey(() => FeeStructure)
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  feeStructureCode: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  dueDate: Date;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Original amount from fee structure',
  })
  baseAmount: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Custom amount after discounts/scholarships',
  })
  customAmount: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Net amount to be paid (customAmount ?? baseAmount)',
  })
  netAmount: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  paidAmount: number;

  @Column({
    type: DataType.ENUM(...Object.values(TransactionStatus)),
    allowNull: false,
    defaultValue: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  remarks: string;

  // Hooks
  @BeforeValidate
  static calculateNetAmount(instance: FeeTransaction) {
    // Calculate netAmount as customAmount if set, otherwise baseAmount
    instance.netAmount = instance.customAmount ?? instance.baseAmount;
  }

  // Associations
  @BelongsTo(() => Student, {
    foreignKey: 'studentId',
    as: 'student',
  })
  student: Student;

  @BelongsTo(() => FeeStructure, {
    foreignKey: 'feeStructureCode',
    as: 'feeStructure',
  })
  feeStructure: FeeStructure;

  @HasMany(() => require('./payment-allocation.entity').PaymentAllocation, {
    foreignKey: 'feeTransactionCode',
    as: 'allocations',
  })
  allocations: any[];
}
