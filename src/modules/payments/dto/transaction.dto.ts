import { IsString, IsNotEmpty, IsOptional, IsNumber, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateTransactionsDto {
  @ApiProperty({
    description: 'Student UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Month in YYYY-MM format',
    example: '2024-01',
    maxLength: 7
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(7)
  month: string; // Format: YYYY-MM

  @ApiProperty({
    description: 'Academic year',
    example: '2023-2024'
  })
  @IsString()
  @IsNotEmpty()
  academicYear: string;
}

export class UpdateTransactionAmountDto {
  @ApiProperty({
    description: 'Custom amount for the transaction (after discounts/scholarships)',
    example: 4500.00,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  customAmount: number;

  @ApiProperty({
    description: 'Remarks for the custom amount',
    example: 'Scholarship applied - 10% discount',
    required: false,
    maxLength: 500
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  remarks?: string;
}
