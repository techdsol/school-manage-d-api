import { PartialType } from '@nestjs/swagger';
import { CreateTeacherSpecializationDto } from './create-teacher-specialization.dto';

export class UpdateTeacherSpecializationDto extends PartialType(CreateTeacherSpecializationDto) { }
