import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsDateString, IsUUID, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { StudentAttendanceStatus } from '../../entities/student-attendance.entity';

export class QueryStudentAttendanceDto {
  @ApiProperty({ required: false, description: 'Filter by timetable ID' })
  @IsOptional()
  @IsUUID()
  timetableId?: string;

  @ApiProperty({ required: false, description: 'Filter by class section code' })
  @IsOptional()
  @IsString()
  classSectionCode?: string;

  @ApiProperty({ required: false, description: 'Filter by student ID' })
  @IsOptional()
  @IsUUID()
  studentId?: string;

  @ApiProperty({ required: false, description: 'Filter by attendance date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  attendanceDate?: string;

  @ApiProperty({ required: false, description: 'Filter by start date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false, description: 'Filter by end date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ enum: StudentAttendanceStatus, required: false, description: 'Filter by attendance status' })
  @IsOptional()
  @IsEnum(StudentAttendanceStatus)
  status?: StudentAttendanceStatus;

  @ApiProperty({ required: false, description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiProperty({ required: false, description: 'Items per page', default: 50 })
  @IsOptional()
  @Type(() => Number)
  limit?: number;
}
