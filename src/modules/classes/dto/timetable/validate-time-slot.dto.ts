import { IsNotEmpty, IsString, IsEnum, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DayOfWeek } from '../../entities/timetable.entity';

export class ValidateTimeSlotDto {
  @ApiProperty({ description: 'Class section code' })
  @IsNotEmpty()
  @IsString()
  classSectionCode: string;

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

  @ApiProperty({ description: 'Academic year', example: '2024-2025' })
  @IsNotEmpty()
  @IsString()
  academicYear: string;

  @ApiPropertyOptional({ description: 'Teacher ID to check for teacher conflicts' })
  @IsOptional()
  @IsString()
  teacherId?: string;

  @ApiPropertyOptional({ description: 'Exclude this timetable ID from conflict check (for updates)' })
  @IsOptional()
  @IsString()
  excludeId?: string;
}
