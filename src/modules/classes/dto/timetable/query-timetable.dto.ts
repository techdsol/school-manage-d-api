import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { DayOfWeek, PeriodType, TimetableStatus } from '../../entities/timetable.entity';

export class QueryTimetableDto {
  @ApiPropertyOptional({ description: 'Class section code' })
  @IsOptional()
  @IsString()
  classSectionCode?: string;

  @ApiPropertyOptional({ description: 'Subject code' })
  @IsOptional()
  @IsString()
  subjectCode?: string;

  @ApiPropertyOptional({ description: 'Teacher ID' })
  @IsOptional()
  @IsString()
  teacherId?: string;

  @ApiPropertyOptional({ description: 'Day of the week', enum: DayOfWeek })
  @IsOptional()
  @IsEnum(DayOfWeek)
  dayOfWeek?: DayOfWeek;

  @ApiPropertyOptional({ description: 'Period type', enum: PeriodType })
  @IsOptional()
  @IsEnum(PeriodType)
  periodType?: PeriodType;

  @ApiPropertyOptional({ description: 'Academic year', example: '2024-2025' })
  @IsOptional()
  @IsString()
  academicYear?: string;

  @ApiPropertyOptional({ description: 'Status', enum: TimetableStatus })
  @IsOptional()
  @IsEnum(TimetableStatus)
  status?: TimetableStatus;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Number of items per page', default: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 50;
}
