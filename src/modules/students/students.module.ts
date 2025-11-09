import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentsService } from './services/students.service';
import { StudentsController } from './controllers/students.controller';
import { StudentAssignmentService } from './services/student-assignment.service';
import { StudentAssignmentController } from './controllers/student-assignment.controller';
import { Student } from './entities/student.entity';
import { StudentAssignment } from './entities/student-assignment.entity';
import { ClassSection } from '../classes/entities/class-section.entity';

@Module({
  imports: [SequelizeModule.forFeature([Student, StudentAssignment, ClassSection])],
  controllers: [StudentsController, StudentAssignmentController],
  providers: [StudentsService, StudentAssignmentService],
  exports: [StudentsService, StudentAssignmentService],
})
export class StudentsModule { }
