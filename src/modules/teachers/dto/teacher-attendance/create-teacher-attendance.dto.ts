import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum, IsDateString, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { TeacherAttendanceStatus } from '../../entities/teacher-attendance.entity';

export class CreateTeacherAttendanceDto {
  @ApiProperty({ description: 'Teacher ID' })
  @IsUUID()
  @IsNotEmpty()
  teacherId: string;

  @ApiProperty({ description: 'Attendance date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  attendanceDate: string;

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

  @ApiProperty({ required: false, description: 'Admin/Manager ID who marked attendance' })
  @IsOptional()
  @IsUUID()
  markedBy?: string;
}
