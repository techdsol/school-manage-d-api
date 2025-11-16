import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction, Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { FeeTransaction, TransactionStatus } from '../entities/fee-transaction.entity';
import { FeeStructure, FeeFrequency } from '../entities/fee-structure.entity';
import { StudentAssignment } from '../../students/entities/student-assignment.entity';
import { ClassSection } from '../../classes/entities/class-section.entity';
import { Student } from '../../students/entities/student.entity';
import { GenerateTransactionsDto, UpdateTransactionAmountDto } from '../dto';

@Injectable()
export class FeeTransactionService {
  constructor(
    @InjectModel(FeeTransaction)
    private feeTransactionModel: typeof FeeTransaction,
    @InjectModel(FeeStructure)
    private feeStructureModel: typeof FeeStructure,
    @InjectModel(StudentAssignment)
    private studentAssignmentModel: typeof StudentAssignment,
    @InjectModel(ClassSection)
    private classSectionModel: typeof ClassSection,
    @InjectModel(Student)
    private studentModel: typeof Student,
    private sequelize: Sequelize,
  ) { }

  async generateTransactions(dto: GenerateTransactionsDto): Promise<FeeTransaction[]> {
    const { studentId, month, academicYear } = dto;

    // Validate student exists
    const student = await this.studentModel.findByPk(studentId);
    if (!student) {
      throw new NotFoundException(`Student '${studentId}' not found`);
    }

    // Get all active assignments for student
    const assignments = await this.studentAssignmentModel.findAll({
      where: {
        studentId,
        status: 'ACTIVE',
      },
      include: [
        {
          model: ClassSection,
          as: 'classSection',
          required: true,
        },
      ],
    });

    if (assignments.length === 0) {
      throw new BadRequestException(`No active assignments found for student '${studentId}'`);
    }

    // Get unique class codes from assignments
    const classCodes = [...new Set(assignments.map((a) => a.classSection.classCode))];

    // Get applicable fee structures for these classes
    const feeStructures = await this.feeStructureModel.findAll({
      where: {
        classCode: classCodes,
        academicYear,
        isActive: true,
      },
    });

    if (feeStructures.length === 0) {
      throw new BadRequestException(`No fee structures found for student's classes in academic year '${academicYear}'`);
    }

    // Parse month (format: YYYY-MM)
    const [year, monthNum] = month.split('-').map(Number);
    const dueDate = new Date(year, monthNum - 1, 10); // 10th of the month

    const transactions: FeeTransaction[] = [];
    const transaction = await this.sequelize.transaction();

    try {
      for (const feeStructure of feeStructures) {
        // Check if transaction already exists for this month
        const transactionCode = `TXN-${studentId}-${month.replace('-', '')}-${feeStructure.code}`;
        const existing = await this.feeTransactionModel.findOne({
          where: { code: transactionCode },
          transaction,
        });

        if (existing) {
          continue; // Skip if already generated
        }

        // Check frequency to determine if we should generate for this month
        const shouldGenerate = this.shouldGenerateForMonth(feeStructure.frequency, monthNum);
        if (!shouldGenerate) {
          continue;
        }

        const feeTransaction = await this.feeTransactionModel.create(
          {
            code: transactionCode,
            studentId,
            feeStructureCode: feeStructure.code,
            dueDate,
            baseAmount: feeStructure.amount,
            customAmount: null,
            netAmount: feeStructure.amount,
            paidAmount: 0,
            status: TransactionStatus.PENDING,
            remarks: null,
          },
          { transaction },
        );

        transactions.push(feeTransaction);
      }

      await transaction.commit();
      return transactions;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  private shouldGenerateForMonth(frequency: FeeFrequency, month: number): boolean {
    switch (frequency) {
      case FeeFrequency.MONTHLY:
        return true;
      case FeeFrequency.QUARTERLY:
        // Generate in months 4, 7, 10, 1 (April, July, October, January)
        return [1, 4, 7, 10].includes(month);
      case FeeFrequency.HALF_YEARLY:
        // Generate in months 4, 10 (April, October)
        return [4, 10].includes(month);
      case FeeFrequency.ANNUAL:
        // Generate in month 4 (April)
        return month === 4;
      case FeeFrequency.ONE_TIME:
        // Generate only in April (month 4)
        return month === 4;
      default:
        return false;
    }
  }

  async findAll(filters?: {
    studentId?: string;
    status?: TransactionStatus;
    fromDate?: string;
    toDate?: string;
  }): Promise<FeeTransaction[]> {
    const where: any = {};

    if (filters?.studentId) {
      where.studentId = filters.studentId;
    }
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.fromDate) {
      where.dueDate = { ...where.dueDate, [Op.gte]: filters.fromDate };
    }
    if (filters?.toDate) {
      where.dueDate = { ...where.dueDate, [Op.lte]: filters.toDate };
    }

    return this.feeTransactionModel.findAll({
      where,
      include: [
        {
          model: FeeStructure,
          as: 'feeStructure',
        },
        {
          model: Student,
          as: 'student',
        },
      ],
      order: [['dueDate', 'ASC'], ['createdAt', 'ASC']],
    });
  }

  async findOne(code: string): Promise<FeeTransaction> {
    const transaction = await this.feeTransactionModel.findByPk(code, {
      include: [
        {
          model: FeeStructure,
          as: 'feeStructure',
        },
        {
          model: Student,
          as: 'student',
        },
      ],
    });

    if (!transaction) {
      throw new NotFoundException(`Fee transaction '${code}' not found`);
    }
    return transaction;
  }

  async updateCustomAmount(code: string, dto: UpdateTransactionAmountDto): Promise<FeeTransaction> {
    const feeTransaction = await this.findOne(code);

    if (feeTransaction.status === TransactionStatus.PAID) {
      throw new BadRequestException('Cannot update amount for a paid transaction');
    }

    await feeTransaction.update({
      customAmount: dto.customAmount,
      netAmount: dto.customAmount,
      remarks: dto.remarks,
    });

    return feeTransaction;
  }

  async getStudentOutstanding(studentId: string): Promise<{
    totalDue: number;
    totalPaid: number;
    outstanding: number;
    transactions: FeeTransaction[];
  }> {
    const transactions = await this.feeTransactionModel.findAll({
      where: {
        studentId,
        status: [TransactionStatus.PENDING, TransactionStatus.PARTIAL],
      },
      include: [
        {
          model: FeeStructure,
          as: 'feeStructure',
        },
      ],
      order: [['dueDate', 'ASC']],
    });

    const totalDue = transactions.reduce((sum, t) => sum + Number(t.netAmount), 0);
    const totalPaid = transactions.reduce((sum, t) => sum + Number(t.paidAmount), 0);
    const outstanding = totalDue - totalPaid;

    return {
      totalDue,
      totalPaid,
      outstanding,
      transactions,
    };
  }
}
