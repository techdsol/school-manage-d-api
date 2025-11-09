import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum, IsDateString, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { AttendanceStatus } from '../../entities/attendance.entity';

export class CreateAttendanceDto {
  @ApiProperty({ description: 'Student assignment ID' })
  @IsUUID()
  @IsNotEmpty()
  studentAssignmentId: string;

  @ApiProperty({ description: 'Attendance date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  attendanceDate: string;

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

  @ApiProperty({ required: false, description: 'Teacher ID who marked attendance' })
  @IsOptional()
  @IsUUID()
  markedBy?: string;
}
