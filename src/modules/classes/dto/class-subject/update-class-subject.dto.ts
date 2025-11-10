import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID, IsString } from 'class-validator';
import { ClassSubjectStatus } from '../../entities/class-subject.entity';

export class UpdateClassSubjectDto {
  @ApiProperty({ required: false, description: 'Teacher ID who teaches this subject' })
  @IsOptional()
  @IsUUID()
  teacherId?: string;

  @ApiProperty({ enum: ClassSubjectStatus, required: false })
  @IsOptional()
  @IsEnum(ClassSubjectStatus)
  status?: ClassSubjectStatus;

  @ApiProperty({ required: false, description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
