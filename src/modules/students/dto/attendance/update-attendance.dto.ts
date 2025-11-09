import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AttendanceStatus } from '../../entities/attendance.entity';

export class UpdateAttendanceDto {
  @ApiProperty({ enum: AttendanceStatus, required: false, description: 'Attendance status' })
  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;

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
  @IsString()
  markedBy?: string;
}
