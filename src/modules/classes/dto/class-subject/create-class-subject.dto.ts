import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsNotEmpty, IsUUID, MaxLength } from 'class-validator';
import { ClassSubjectStatus } from '../../entities/class-subject.entity';

export class CreateClassSubjectDto {
  @ApiProperty({ description: 'Class section code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  classSectionCode: string;

  @ApiProperty({ description: 'Subject code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  subjectCode: string;

  @ApiProperty({ required: false, description: 'Teacher ID who teaches this subject' })
  @IsOptional()
  @IsUUID()
  teacherId?: string;

  @ApiProperty({ enum: ClassSubjectStatus, required: false, default: ClassSubjectStatus.ACTIVE })
  @IsOptional()
  @IsEnum(ClassSubjectStatus)
  status?: ClassSubjectStatus;

  @ApiProperty({ required: false, description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
