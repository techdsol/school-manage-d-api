import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentsService } from './services/students.service';
import { StudentsController } from './controllers/students.controller';
import { StudentAssignmentService } from './services/student-assignment.service';
import { StudentAssignmentController } from './controllers/student-assignment.controller';
import { AttendanceService } from './services/attendance.service';
import { AttendanceController } from './controllers/attendance.controller';
import { Student } from './entities/student.entity';
import { StudentAssignment } from './entities/student-assignment.entity';
import { Attendance } from './entities/attendance.entity';
import { ClassSection } from '../classes/entities/class-section.entity';

@Module({
  imports: [SequelizeModule.forFeature([Student, StudentAssignment, Attendance, ClassSection])],
  controllers: [StudentsController, StudentAssignmentController, AttendanceController],
  providers: [StudentsService, StudentAssignmentService, AttendanceService],
  exports: [StudentsService, StudentAssignmentService, AttendanceService],
})
export class StudentsModule { }
