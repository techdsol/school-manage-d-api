import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Payment } from './payment.entity';
import { FeeTransaction } from './fee-transaction.entity';

@Table({
  tableName: 'payment_allocations',
  timestamps: true,
  paranoid: false,
})
export class PaymentAllocation extends Model<PaymentAllocation> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id: number;

  @ForeignKey(() => Payment)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  paymentId: number;

  @ForeignKey(() => FeeTransaction)
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  feeTransactionCode: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  allocatedAmount: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  allocationDate: Date;

  // Associations
  @BelongsTo(() => Payment, {
    foreignKey: 'paymentId',
    as: 'payment',
  })
  payment: Payment;

  @BelongsTo(() => FeeTransaction, {
    foreignKey: 'feeTransactionCode',
    as: 'feeTransaction',
  })
  feeTransaction: FeeTransaction;
}
