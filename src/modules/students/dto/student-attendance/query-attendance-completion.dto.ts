import { IsDateString, IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryAttendanceCompletionDto {
  @ApiPropertyOptional({
    description: 'Start date for the report (YYYY-MM-DD)',
    example: '2024-11-01',
  })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({
    description: 'End date for the report (YYYY-MM-DD)',
    example: '2024-11-07',
  })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({
    description: 'Filter by specific class section code',
    example: '1A',
  })
  @IsOptional()
  @IsString()
  classSectionCode?: string;

  @ApiPropertyOptional({
    description: 'Filter by academic year',
    example: '2024-2025',
  })
  @IsOptional()
  @IsString()
  academicYear?: string;

  @ApiPropertyOptional({
    description: 'Show only class sections with completion rate below this percentage (0-100)',
    example: 80,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  minCompletionPercent?: number;
}
