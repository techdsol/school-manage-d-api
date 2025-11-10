import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum, IsDateString, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { StudentAttendanceStatus } from '../../entities/student-attendance.entity';

export class CreateStudentAttendanceDto {
  @ApiProperty({ description: 'Timetable entry ID' })
  @IsUUID()
  @IsNotEmpty()
  timetableId: string;

  @ApiProperty({ description: 'Student ID' })
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ description: 'Attendance date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  attendanceDate: string;

  @ApiProperty({ enum: StudentAttendanceStatus, description: 'Attendance status' })
  @IsEnum(StudentAttendanceStatus)
  @IsNotEmpty()
  status: StudentAttendanceStatus;

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
