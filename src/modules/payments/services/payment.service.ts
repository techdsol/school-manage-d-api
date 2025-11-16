import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Payment } from '../entities/payment.entity';
import { PaymentAllocation } from '../entities/payment-allocation.entity';
import { FeeTransaction, TransactionStatus } from '../entities/fee-transaction.entity';
import { Student } from '../../students/entities/student.entity';
import { CreatePaymentDto } from '../dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
    @InjectModel(PaymentAllocation)
    private allocationModel: typeof PaymentAllocation,
    @InjectModel(FeeTransaction)
    private feeTransactionModel: typeof FeeTransaction,
    @InjectModel(Student)
    private studentModel: typeof Student,
    private sequelize: Sequelize,
  ) { }

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const { studentId, amount, paymentDate, paymentMode, referenceNumber, remarks } = createPaymentDto;

    // Validate student exists
    const student = await this.studentModel.findByPk(studentId);
    if (!student) {
      throw new NotFoundException(`Student '${studentId}' not found`);
    }

    if (amount <= 0) {
      throw new BadRequestException('Payment amount must be greater than zero');
    }

    const transaction = await this.sequelize.transaction();

    try {
      // Create payment record
      const payment = await this.paymentModel.create(
        {
          studentId,
          amount,
          paymentDate: new Date(paymentDate),
          paymentMode,
          referenceNumber,
          remarks,
        },
        { transaction },
      );

      // Get pending/partial transactions ordered by dueDate (oldest first)
      const pendingTransactions = await this.feeTransactionModel.findAll({
        where: {
          studentId,
          status: [TransactionStatus.PENDING, TransactionStatus.PARTIAL],
        },
        order: [
          ['dueDate', 'ASC'],
          ['createdAt', 'ASC'],
        ],
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (pendingTransactions.length === 0) {
        throw new BadRequestException('No pending transactions found for this student');
      }

      // Allocate payment to transactions (oldest first)
      let remainingAmount = amount;
      const allocations: PaymentAllocation[] = [];

      for (const feeTransaction of pendingTransactions) {
        if (remainingAmount <= 0) {
          break;
        }

        const outstanding = Number(feeTransaction.netAmount) - Number(feeTransaction.paidAmount);
        const allocatedAmount = Math.min(remainingAmount, outstanding);

        // Create allocation record
        const allocation = await this.allocationModel.create(
          {
            paymentId: payment.id,
            feeTransactionCode: feeTransaction.code,
            allocatedAmount,
            allocationDate: new Date(),
          },
          { transaction },
        );

        allocations.push(allocation);

        // Update transaction
        const newPaidAmount = Number(feeTransaction.paidAmount) + allocatedAmount;
        const newStatus =
          newPaidAmount >= Number(feeTransaction.netAmount)
            ? TransactionStatus.PAID
            : TransactionStatus.PARTIAL;

        await feeTransaction.update(
          {
            paidAmount: newPaidAmount,
            status: newStatus,
          },
          { transaction },
        );

        remainingAmount -= allocatedAmount;
      }

      await transaction.commit();

      // Return payment with allocations
      return this.findOne(payment.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async findAll(filters?: { studentId?: string; fromDate?: string; toDate?: string }): Promise<Payment[]> {
    const where: any = {};

    if (filters?.studentId) {
      where.studentId = filters.studentId;
    }
    if (filters?.fromDate || filters?.toDate) {
      where.paymentDate = {};
      if (filters.fromDate) {
        where.paymentDate.gte = filters.fromDate;
      }
      if (filters.toDate) {
        where.paymentDate.lte = filters.toDate;
      }
    }

    return this.paymentModel.findAll({
      where,
      include: [
        {
          model: Student,
          as: 'student',
        },
        {
          model: PaymentAllocation,
          as: 'allocations',
          include: [
            {
              model: FeeTransaction,
              as: 'feeTransaction',
            },
          ],
        },
      ],
      order: [['paymentDate', 'DESC'], ['createdAt', 'DESC']],
    });
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentModel.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
        },
        {
          model: PaymentAllocation,
          as: 'allocations',
          include: [
            {
              model: FeeTransaction,
              as: 'feeTransaction',
            },
          ],
        },
      ],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async getStudentPaymentHistory(studentId: string): Promise<Payment[]> {
    return this.findAll({ studentId });
  }
}
