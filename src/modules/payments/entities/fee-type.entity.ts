import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  HasMany,
} from 'sequelize-typescript';

export enum FeeApplicability {
  CURRICULAR = 'CURRICULAR',
  EXTRA_CURRICULAR = 'EXTRA_CURRICULAR',
  BOTH = 'BOTH',
}

@Table({
  tableName: 'fee_types',
  timestamps: true,
  paranoid: true,
})
export class FeeType extends Model<FeeType> {
  @PrimaryKey
  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  code: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.ENUM(...Object.values(FeeApplicability)),
    allowNull: false,
    defaultValue: FeeApplicability.BOTH,
  })
  applicableTo: FeeApplicability;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;

  // Associations
  @HasMany(() => require('./fee-structure.entity').FeeStructure, {
    foreignKey: 'feeTypeCode',
    as: 'feeStructures',
  })
  feeStructures: any[];
}
