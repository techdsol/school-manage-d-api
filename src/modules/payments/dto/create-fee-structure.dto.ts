import { IsString, IsNotEmpty, IsEnum, IsNumber, IsBoolean, IsOptional, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FeeFrequency } from '../entities/fee-structure.entity';

export class CreateFeeStructureDto {
  @ApiProperty({
    description: 'Fee structure code (unique identifier)',
    example: 'CLASS1-TUITION-2024',
    maxLength: 50
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @ApiProperty({
    description: 'Fee type code',
    example: 'TUITION'
  })
  @IsString()
  @IsNotEmpty()
  feeTypeCode: string;

  @ApiProperty({
    description: 'Class code',
    example: 'CLASS1'
  })
  @IsString()
  @IsNotEmpty()
  classCode: string;

  @ApiProperty({
    description: 'Fee payment frequency',
    enum: FeeFrequency,
    example: FeeFrequency.MONTHLY
  })
  @IsEnum(FeeFrequency)
  @IsNotEmpty()
  frequency: FeeFrequency;

  @ApiProperty({
    description: 'Fee amount',
    example: 5000.00,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    description: 'Academic year',
    example: '2023-2024'
  })
  @IsString()
  @IsNotEmpty()
  academicYear: string;

  @ApiProperty({
    description: 'Whether the fee structure is active',
    example: true,
    required: false,
    default: true
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
