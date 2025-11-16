import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Student } from '../../students/entities/student.entity';

export enum PaymentMode {
  CASH = 'CASH',
  CHEQUE = 'CHEQUE',
  UPI = 'UPI',
  CARD = 'CARD',
  NET_BANKING = 'NET_BANKING',
  DEMAND_DRAFT = 'DEMAND_DRAFT',
}

@Table({
  tableName: 'payments',
  timestamps: true,
  paranoid: true,
})
export class Payment extends Model<Payment> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id: number;

  @ForeignKey(() => Student)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  studentId: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  amount: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  paymentDate: Date;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentMode)),
    allowNull: false,
  })
  paymentMode: PaymentMode;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    comment: 'Cheque/Transaction/DD number',
  })
  referenceNumber: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  remarks: string;

  // Associations
  @BelongsTo(() => Student, {
    foreignKey: 'studentId',
    as: 'student',
  })
  student: Student;

  @HasMany(() => require('./payment-allocation.entity').PaymentAllocation, {
    foreignKey: 'paymentId',
    as: 'allocations',
  })
  allocations: any[];
}
