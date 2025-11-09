import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsOptional, IsEnum, MaxLength } from 'class-validator';

export class CreateStudentAssignmentDto {
  @ApiProperty({ description: 'Student ID (UUID)' })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ description: 'Class Section Code', maxLength: 8 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(8)
  classSectionCode: string;

  @ApiProperty({ description: 'Student roll number in the class', maxLength: 20 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  rollNumber: string;

  @ApiProperty({ description: 'Assignment date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  assignmentDate: string;

  @ApiProperty({ description: 'Unassignment date (YYYY-MM-DD)', required: false })
  @IsOptional()
  @IsDateString()
  unassignmentDate?: string;

  @ApiProperty({ 
    description: 'Assignment status',
    enum: ['ACTIVE', 'INACTIVE', 'TRANSFERRED', 'WITHDRAWN'],
    default: 'ACTIVE',
    required: false
  })
  @IsOptional()
  @IsEnum(['ACTIVE', 'INACTIVE', 'TRANSFERRED', 'WITHDRAWN'])
  status?: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
