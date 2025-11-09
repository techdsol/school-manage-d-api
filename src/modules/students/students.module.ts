import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentsService } from './services/students.service';
import { StudentsController } from './controllers/students.controller';
import { StudentAssignmentService } from './services/student-assignment.service';
import { StudentAssignmentController } from './controllers/student-assignment.controller';
import { StudentAttendanceService } from './services/student-attendance.service';
import { StudentAttendanceController } from './controllers/student-attendance.controller';
import { Student } from './entities/student.entity';
import { StudentAssignment } from './entities/student-assignment.entity';
import { StudentAttendance } from './entities/student-attendance.entity';
import { ClassSection } from '../classes/entities/class-section.entity';

@Module({
  imports: [SequelizeModule.forFeature([Student, StudentAssignment, StudentAttendance, ClassSection])],
  controllers: [StudentsController, StudentAssignmentController, StudentAttendanceController],
  providers: [StudentsService, StudentAssignmentService, StudentAttendanceService],
  exports: [StudentsService, StudentAssignmentService, StudentAttendanceService],
})
export class StudentsModule { }
