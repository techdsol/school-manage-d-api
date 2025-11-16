import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, IsDateString, IsNotEmpty, IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { TeacherAttendanceStatus } from '../../entities/teacher-attendance.entity';

export class BulkTeacherAttendanceItemDto {
  @ApiProperty({ description: 'Teacher ID' })
  @IsString()
  @IsNotEmpty()
  teacherId: string;

  @ApiProperty({ enum: TeacherAttendanceStatus, description: 'Attendance status' })
  @IsEnum(TeacherAttendanceStatus)
  @IsNotEmpty()
  status: TeacherAttendanceStatus;

  @ApiProperty({ required: false, description: 'Check-in time (HH:MM:SS)' })
  @IsOptional()
  @IsString()
  checkInTime?: string;

  @ApiProperty({ required: false, description: 'Check-out time (HH:MM:SS)' })
  @IsOptional()
  @IsString()
  checkOutTime?: string;

  @ApiProperty({ required: false, description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class BulkCreateTeacherAttendanceDto {
  @ApiProperty({ description: 'Attendance date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  attendanceDate: string;

  @ApiProperty({ required: false, description: 'Admin/Manager ID who marked attendance' })
  @IsOptional()
  @IsString()
  markedBy?: string;

  @ApiProperty({ type: [BulkTeacherAttendanceItemDto], description: 'Array of attendance records' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkTeacherAttendanceItemDto)
  attendances: BulkTeacherAttendanceItemDto[];
}
