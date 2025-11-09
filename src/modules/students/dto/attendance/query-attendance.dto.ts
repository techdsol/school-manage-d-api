import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsDateString, IsUUID, IsString } from 'class-validator';
import { AttendanceStatus } from '../../entities/attendance.entity';

export class QueryAttendanceDto {
  @ApiProperty({ required: false, description: 'Filter by student assignment ID' })
  @IsOptional()
  @IsUUID()
  studentAssignmentId?: string;

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

  @ApiProperty({ enum: AttendanceStatus, required: false, description: 'Filter by attendance status' })
  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;

  @ApiProperty({ required: false, description: 'Page number', default: 1 })
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false, description: 'Items per page', default: 50 })
  @IsOptional()
  limit?: number;
}
