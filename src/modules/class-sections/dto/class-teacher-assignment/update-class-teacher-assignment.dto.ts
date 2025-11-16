import { PartialType } from '@nestjs/swagger';
import { CreateClassTeacherAssignmentDto } from './create-class-teacher-assignment.dto';

export class UpdateClassTeacherAssignmentDto extends PartialType(
  CreateClassTeacherAssignmentDto,
) { }
