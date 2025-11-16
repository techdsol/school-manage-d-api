import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    // Create fee_types table
    await queryInterface.createTable('fee_types', {
      code: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      applicableTo: {
        type: DataTypes.ENUM('CURRICULAR', 'EXTRA_CURRICULAR', 'BOTH'),
        allowNull: false,
        defaultValue: 'BOTH',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    });

    // Create fee_structures table
    await queryInterface.createTable('fee_structures', {
      code: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
      },
      feeTypeCode: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
          model: 'fee_types',
          key: 'code',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      classCode: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'References class code (e.g., 10, DANCE-BEG)',
        references: {
          model: 'classes',
          key: 'code',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      frequency: {
        type: DataTypes.ENUM('MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'ANNUAL', 'ONE_TIME'),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      academicYear: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    });

    // Create indexes for fee_structures
    await queryInterface.addIndex('fee_structures', ['feeTypeCode'], {
      name: 'idx_fee_structures_fee_type_code',
    });
    await queryInterface.addIndex('fee_structures', ['classCode'], {
      name: 'idx_fee_structures_class_code',
    });
    await queryInterface.addIndex('fee_structures', ['academicYear'], {
      name: 'idx_fee_structures_academic_year',
    });

    // Create fee_transactions table
    await queryInterface.createTable('fee_transactions', {
      code: {
        type: DataTypes.STRING(100),
        primaryKey: true,
        allowNull: false,
      },
      studentId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
          model: 'students',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      feeStructureCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
          model: 'fee_structures',
          key: 'code',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      baseAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Original amount from fee structure',
      },
      customAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Custom amount after discounts/scholarships',
      },
      netAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Net amount to be paid (customAmount ?? baseAmount)',
      },
      paidAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM('PENDING', 'PARTIAL', 'PAID', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      remarks: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    });

    // Create indexes for fee_transactions
    await queryInterface.addIndex('fee_transactions', ['studentId'], {
      name: 'idx_fee_transactions_student_id',
    });
    await queryInterface.addIndex('fee_transactions', ['feeStructureCode'], {
      name: 'idx_fee_transactions_fee_structure_code',
    });
    await queryInterface.addIndex('fee_transactions', ['status'], {
      name: 'idx_fee_transactions_status',
    });
    await queryInterface.addIndex('fee_transactions', ['dueDate'], {
      name: 'idx_fee_transactions_due_date',
    });

    // Create payments table
    await queryInterface.createTable('payments', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      studentId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
          model: 'students',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      paymentDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      paymentMode: {
        type: DataTypes.ENUM('CASH', 'CHEQUE', 'UPI', 'CARD', 'NET_BANKING', 'DEMAND_DRAFT'),
        allowNull: false,
      },
      referenceNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Cheque/Transaction/DD number',
      },
      remarks: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    });

    // Create indexes for payments
    await queryInterface.addIndex('payments', ['studentId'], {
      name: 'idx_payments_student_id',
    });
    await queryInterface.addIndex('payments', ['paymentDate'], {
      name: 'idx_payments_payment_date',
    });

    // Create payment_allocations table
    await queryInterface.createTable('payment_allocations', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      paymentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'payments',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      feeTransactionCode: {
        type: DataTypes.STRING(100),
        allowNull: false,
        references: {
          model: 'fee_transactions',
          key: 'code',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      allocatedAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      allocationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });

    // Create indexes for payment_allocations
    await queryInterface.addIndex('payment_allocations', ['paymentId'], {
      name: 'idx_payment_allocations_payment_id',
    });
    await queryInterface.addIndex('payment_allocations', ['feeTransactionCode'], {
      name: 'idx_payment_allocations_fee_transaction_code',
    });
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    // Drop tables in reverse order
    await queryInterface.dropTable('payment_allocations');
    await queryInterface.dropTable('payments');
    await queryInterface.dropTable('fee_transactions');
    await queryInterface.dropTable('fee_structures');
    await queryInterface.dropTable('fee_types');
  },
};
