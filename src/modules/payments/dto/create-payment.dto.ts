import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional, IsDateString, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMode } from '../entities/payment.entity';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Student UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Payment amount',
    example: 5000.00,
    minimum: 0.01
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'Payment date (ISO 8601 format)',
    example: '2024-01-15'
  })
  @IsDateString()
  @IsNotEmpty()
  paymentDate: string;

  @ApiProperty({
    description: 'Payment mode',
    enum: PaymentMode,
    example: PaymentMode.CASH
  })
  @IsEnum(PaymentMode)
  @IsNotEmpty()
  paymentMode: PaymentMode;

  @ApiProperty({
    description: 'Payment reference number (e.g., transaction ID, cheque number)',
    example: 'TXN123456789',
    required: false,
    maxLength: 100
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  referenceNumber?: string;

  @ApiProperty({
    description: 'Additional remarks or notes',
    example: 'Payment for January 2024 fees',
    required: false,
    maxLength: 500
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  remarks?: string;
}
