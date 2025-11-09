import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsDateString, IsUUID, IsString } from 'class-validator';
import { TeacherAttendanceStatus } from '../../entities/teacher-attendance.entity';

export class QueryTeacherAttendanceDto {
  @ApiProperty({ required: false, description: 'Filter by teacher ID' })
  @IsOptional()
  @IsUUID()
  teacherId?: string;

  @ApiProperty({ required: false, description: 'Filter by teacher name' })
  @IsOptional()
  @IsString()
  teacherName?: string;

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

  @ApiProperty({ enum: TeacherAttendanceStatus, required: false, description: 'Filter by attendance status' })
  @IsOptional()
  @IsEnum(TeacherAttendanceStatus)
  status?: TeacherAttendanceStatus;

  @ApiProperty({ required: false, description: 'Page number', default: 1 })
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false, description: 'Items per page', default: 50 })
  @IsOptional()
  limit?: number;
}
