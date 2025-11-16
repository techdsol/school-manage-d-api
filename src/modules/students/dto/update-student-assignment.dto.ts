import { PartialType } from '@nestjs/swagger';
import { CreateStudentAssignmentDto } from './create-student-assignment.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, IsEnum, MaxLength } from 'class-validator';

export class UpdateStudentAssignmentDto extends PartialType(CreateStudentAssignmentDto) {
  @ApiProperty({ description: 'Student roll number in the class', maxLength: 20, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  rollNumber?: string;

  @ApiProperty({ description: 'Unassignment date (YYYY-MM-DD)', required: false })
  @IsOptional()
  @IsDateString()
  unassignmentDate?: string;

  @ApiProperty({ 
    description: 'Assignment status',
    enum: ['ACTIVE', 'INACTIVE', 'TRANSFERRED', 'WITHDRAWN'],
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
