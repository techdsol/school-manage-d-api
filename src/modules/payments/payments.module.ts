import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

// Entities
import {
  FeeType,
  FeeStructure,
  FeeTransaction,
  Payment,
  PaymentAllocation,
} from './entities';

// External Entities
import { Student } from '../students/entities/student.entity';
import { StudentAssignment } from '../students/entities/student-assignment.entity';
import { Class } from '../classes/entities/class.entity';
import { ClassSection } from '../classes/entities/class-section.entity';

// Services
import {
  FeeTypeService,
  FeeStructureService,
  FeeTransactionService,
  PaymentService,
} from './services';

// Controllers
import {
  FeeTypeController,
  FeeStructureController,
  FeeTransactionController,
  PaymentController,
} from './controllers';

@Module({
  imports: [
    SequelizeModule.forFeature([
      // Payment entities
      FeeType,
      FeeStructure,
      FeeTransaction,
      Payment,
      PaymentAllocation,
      // External entities
      Student,
      StudentAssignment,
      Class,
      ClassSection,
    ]),
  ],
  controllers: [
    FeeTypeController,
    FeeStructureController,
    FeeTransactionController,
    PaymentController,
  ],
  providers: [
    FeeTypeService,
    FeeStructureService,
    FeeTransactionService,
    PaymentService,
  ],
  exports: [
    FeeTypeService,
    FeeStructureService,
    FeeTransactionService,
    PaymentService,
  ],
})
export class PaymentsModule { }
