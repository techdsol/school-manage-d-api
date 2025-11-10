import { IsNotEmpty, IsString, IsEnum, IsOptional, IsArray, ValidateNested, IsInt, Min, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { DayOfWeek, PeriodType, TimetableStatus } from '../../entities/timetable.entity';

export class PeriodScheduleDto {
  @ApiProperty({ description: 'Day of the week', enum: DayOfWeek })
  @IsNotEmpty()
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @ApiProperty({ description: 'Start time in HH:mm:ss format', example: '09:00:00' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'startTime must be in HH:mm:ss format',
  })
  startTime: string;

  @ApiProperty({ description: 'End time in HH:mm:ss format', example: '10:00:00' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'endTime must be in HH:mm:ss format',
  })
  endTime: string;

  @ApiPropertyOptional({ description: 'Period number for ordering', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  periodNumber?: number;

  @ApiPropertyOptional({ description: 'Room number or location' })
  @IsOptional()
  @IsString()
  room?: string;
}

export class BulkCreateMultiDayDto {
  @ApiProperty({ description: 'Class section code' })
  @IsNotEmpty()
  @IsString()
  classSectionCode: string;

  @ApiPropertyOptional({ description: 'Subject code (null for non-teaching periods)' })
  @IsOptional()
  @IsString()
  subjectCode?: string;

  @ApiPropertyOptional({ description: 'Teacher ID (null for periods without teacher)' })
  @IsOptional()
  @IsString()
  teacherId?: string;

  @ApiProperty({ description: 'Academic year', example: '2024-2025' })
  @IsNotEmpty()
  @IsString()
  academicYear: string;

  @ApiProperty({ description: 'Type of period', enum: PeriodType, default: PeriodType.TEACHING })
  @IsOptional()
  @IsEnum(PeriodType)
  periodType?: PeriodType;

  @ApiPropertyOptional({ description: 'Status', enum: TimetableStatus, default: TimetableStatus.ACTIVE })
  @IsOptional()
  @IsEnum(TimetableStatus)
  status?: TimetableStatus;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Array of period schedules with different day/time combinations',
    type: [PeriodScheduleDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PeriodScheduleDto)
  periods: PeriodScheduleDto[];
}
