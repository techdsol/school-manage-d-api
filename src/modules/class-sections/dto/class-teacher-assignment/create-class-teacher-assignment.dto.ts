import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { AssignmentRole, AssignmentStatus } from '../../entities/class-teacher-assignment.entity';

export class CreateClassTeacherAssignmentDto {
  @ApiProperty({
    description: 'Teacher ID',
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  @IsNotEmpty()
  @IsUUID()
  teacherId: string;

  @ApiProperty({
    description: 'Class Section Code',
    example: '1A',
  })
  @IsNotEmpty()
  @IsString()
  classSectionCode: string;

  @ApiProperty({
    description: 'Assignment role (PRIMARY or SECONDARY)',
    enum: AssignmentRole,
    example: AssignmentRole.PRIMARY,
  })
  @IsNotEmpty()
  @IsEnum(AssignmentRole)
  role: AssignmentRole;

  @ApiProperty({
    description: 'Assignment status (ACTIVE or INACTIVE)',
    enum: AssignmentStatus,
    example: AssignmentStatus.ACTIVE,
    required: false,
    default: AssignmentStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(AssignmentStatus)
  status?: AssignmentStatus;

  @ApiProperty({
    description: 'Assignment start date (YYYY-MM-DD)',
    example: '2024-04-01',
  })
  @IsNotEmpty()
  @IsDateString()
  assignmentStartDate: string;

  @ApiProperty({
    description: 'Assignment end date (YYYY-MM-DD) - optional',
    example: '2025-03-31',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  assignmentEndDate?: string;

  @ApiProperty({
    description: 'Additional notes about the assignment',
    example: 'Primary class teacher for academic year 2024-2025',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
