import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FeeApplicability } from '../entities/fee-type.entity';

export class CreateFeeTypeDto {
  @ApiProperty({
    description: 'Fee type code (unique identifier)',
    example: 'TUITION',
    maxLength: 20
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  code: string;

  @ApiProperty({
    description: 'Fee type name',
    example: 'Tuition Fee',
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Description of the fee type',
    example: 'Monthly tuition fee for regular classes',
    required: false,
    maxLength: 255
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @ApiProperty({
    description: 'Fee applicability',
    enum: FeeApplicability,
    example: FeeApplicability.CURRICULAR
  })
  @IsEnum(FeeApplicability)
  @IsNotEmpty()
  applicableTo: FeeApplicability;

  @ApiProperty({
    description: 'Whether the fee type is active',
    example: true,
    required: false,
    default: true
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
