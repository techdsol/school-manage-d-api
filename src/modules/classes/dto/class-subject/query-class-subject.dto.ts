import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsUUID } from 'class-validator';
import { ClassSubjectStatus } from '../../entities/class-subject.entity';

export class QueryClassSubjectDto {
  @ApiProperty({ required: false, description: 'Filter by class section code' })
  @IsOptional()
  @IsString()
  classSectionCode?: string;

  @ApiProperty({ required: false, description: 'Filter by subject code' })
  @IsOptional()
  @IsString()
  subjectCode?: string;

  @ApiProperty({ required: false, description: 'Filter by teacher ID' })
  @IsOptional()
  @IsUUID()
  teacherId?: string;

  @ApiProperty({ enum: ClassSubjectStatus, required: false, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(ClassSubjectStatus)
  status?: ClassSubjectStatus;

  @ApiProperty({ required: false, description: 'Page number', default: 1 })
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false, description: 'Items per page', default: 50 })
  @IsOptional()
  limit?: number;
}
