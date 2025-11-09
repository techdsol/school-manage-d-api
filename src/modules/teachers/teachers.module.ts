import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TeachersService } from './services/teachers.service';
import { TeachersController } from './controllers/teachers.controller';
import { TeacherAttendanceService } from './services/teacher-attendance.service';
import { TeacherAttendanceController } from './controllers/teacher-attendance.controller';
import { Teacher } from './entities/teacher.entity';
import { TeacherAttendance } from './entities/teacher-attendance.entity';

@Module({
  imports: [SequelizeModule.forFeature([Teacher, TeacherAttendance])],
  controllers: [TeachersController, TeacherAttendanceController],
  providers: [TeachersService, TeacherAttendanceService],
  exports: [TeachersService, TeacherAttendanceService, SequelizeModule],
})
export class TeachersModule { }
