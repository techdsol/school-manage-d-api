import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TeacherAttendanceStatus } from '../../entities/teacher-attendance.entity';

export class UpdateTeacherAttendanceDto {
  @ApiProperty({ enum: TeacherAttendanceStatus, required: false, description: 'Attendance status' })
  @IsOptional()
  @IsEnum(TeacherAttendanceStatus)
  status?: TeacherAttendanceStatus;

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

  @ApiProperty({ required: false, description: 'Admin/Manager ID who marked attendance' })
  @IsOptional()
  @IsString()
  markedBy?: string;
}
