import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, IsDateString, IsNotEmpty, IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceStatus } from '../../entities/attendance.entity';

export class BulkAttendanceItemDto {
  @ApiProperty({ description: 'Student assignment ID' })
  @IsString()
  @IsNotEmpty()
  studentAssignmentId: string;

  @ApiProperty({ enum: AttendanceStatus, description: 'Attendance status' })
  @IsEnum(AttendanceStatus)
  @IsNotEmpty()
  status: AttendanceStatus;

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

export class BulkCreateAttendanceDto {
  @ApiProperty({ description: 'Attendance date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  attendanceDate: string;

  @ApiProperty({ required: false, description: 'Teacher ID who marked attendance' })
  @IsOptional()
  @IsString()
  markedBy?: string;

  @ApiProperty({ type: [BulkAttendanceItemDto], description: 'Array of attendance records' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkAttendanceItemDto)
  attendances: BulkAttendanceItemDto[];
}
