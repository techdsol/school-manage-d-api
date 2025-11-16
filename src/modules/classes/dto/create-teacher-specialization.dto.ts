import { IsUUID, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeacherSpecializationDto {
  @ApiProperty({ description: 'Teacher ID (UUID)' })
  @IsUUID()
  teacherId: string;

  @ApiProperty({ description: 'Class code' })
  @IsString()
  @MaxLength(8)
  classCode: string;

  @ApiProperty({ description: 'Subject code' })
  @IsString()
  @MaxLength(8)
  subjectCode: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
