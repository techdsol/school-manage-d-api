import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FeeTransactionService } from '../services/fee-transaction.service';
import { GenerateTransactionsDto, UpdateTransactionAmountDto } from '../dto';
import { TransactionStatus } from '../entities/fee-transaction.entity';

@ApiTags('Student Fee Payments')
@Controller('fee-transactions')
export class FeeTransactionController {
  constructor(private readonly feeTransactionService: FeeTransactionService) { }

  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  generate(@Body() generateTransactionsDto: GenerateTransactionsDto) {
    return this.feeTransactionService.generateTransactions(generateTransactionsDto);
  }

  @Get()
  findAll(
    @Query('studentId') studentId?: string,
    @Query('status') status?: TransactionStatus,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.feeTransactionService.findAll({
      studentId,
      status,
      fromDate,
      toDate,
    });
  }

  @Get('student/:studentId/outstanding')
  getStudentOutstanding(@Param('studentId') studentId: string) {
    return this.feeTransactionService.getStudentOutstanding(studentId);
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.feeTransactionService.findOne(code);
  }

  @Patch(':code/custom-amount')
  updateCustomAmount(
    @Param('code') code: string,
    @Body() updateTransactionAmountDto: UpdateTransactionAmountDto,
  ) {
    return this.feeTransactionService.updateCustomAmount(code, updateTransactionAmountDto);
  }
}
