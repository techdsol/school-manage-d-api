import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { FeeType } from './fee-type.entity';
import { Class } from '../../classes/entities/class.entity';

export enum FeeFrequency {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  HALF_YEARLY = 'HALF_YEARLY',
  ANNUAL = 'ANNUAL',
  ONE_TIME = 'ONE_TIME',
}

@Table({
  tableName: 'fee_structures',
  timestamps: true,
  paranoid: true,
})
export class FeeStructure extends Model<FeeStructure> {
  @PrimaryKey
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  code: string;

  @ForeignKey(() => FeeType)
  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  feeTypeCode: string;

  @ForeignKey(() => Class)
  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    comment: 'References class code (e.g., 10, DANCE-BEG)',
  })
  classCode: string;

  @Column({
    type: DataType.ENUM(...Object.values(FeeFrequency)),
    allowNull: false,
  })
  frequency: FeeFrequency;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  amount: number;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  academicYear: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;

  // Associations
  @BelongsTo(() => FeeType, {
    foreignKey: 'feeTypeCode',
    as: 'feeType',
  })
  feeType: FeeType;

  @BelongsTo(() => Class, {
    foreignKey: 'classCode',
    as: 'class',
  })
  class: Class;

  @HasMany(() => require('./fee-transaction.entity').FeeTransaction, {
    foreignKey: 'feeStructureCode',
    as: 'transactions',
  })
  transactions: any[];
}
