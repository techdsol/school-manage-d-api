import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { AssignmentRole, AssignmentStatus } from '../../entities/class-teacher-assignment.entity';

export class QueryClassTeacherAssignmentDto {
  @ApiProperty({
    description: 'Filter by teacher ID',
    required: false,
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @IsUUID()
  teacherId?: string;

  @ApiProperty({
    description: 'Filter by class section code',
    required: false,
    example: '1A',
  })
  @IsOptional()
  @IsString()
  classSectionCode?: string;

  @ApiProperty({
    description: 'Filter by assignment role',
    enum: AssignmentRole,
    required: false,
    example: AssignmentRole.PRIMARY,
  })
  @IsOptional()
  @IsEnum(AssignmentRole)
  role?: AssignmentRole;

  @ApiProperty({
    description: 'Filter by assignment status',
    enum: AssignmentStatus,
    required: false,
    example: AssignmentStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(AssignmentStatus)
  status?: AssignmentStatus;

  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    default: 10,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
