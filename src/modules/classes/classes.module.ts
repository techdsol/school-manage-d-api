import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClassType } from './entities/class-type.entity';
import { Class } from './entities/class.entity';
import { ClassSection } from './entities/class-section.entity';
import { TeacherSpecialization } from './entities/teacher-specialization.entity';
import { ClassTeacherAssignment } from '../class-sections/entities/class-teacher-assignment.entity';
import { ClassSubject } from './entities/class-subject.entity';
import { Timetable } from './entities/timetable.entity';
import { ClassTypesService } from './services/class-types.service';
import { ClassesService } from './services/classes.service';
import { ClassSectionsService } from './services/class-sections.service';
import { TeacherSpecializationService } from './services/teacher-specialization.service';
import { ClassTeacherAssignmentService } from '../class-sections/services/class-teacher-assignment.service';
import { ClassSubjectService } from './services/class-subject.service';
import { TimetableService } from './services/timetable.service';
import { ClassTypesController } from './controllers/class-types.controller';
import { ClassesController } from './controllers/classes.controller';
import { ClassSectionsController } from './controllers/class-sections.controller';
import { TeacherSpecializationController } from './controllers/teacher-specialization.controller';
import { ClassTeacherAssignmentController } from '../class-sections/controllers/class-teacher-assignment.controller';
import { ClassSubjectController } from './controllers/class-subject.controller';
import { TimetableController } from './controllers/timetable.controller';
import { AcademicYearsModule } from '../academic-years';
import { TeachersModule } from '../teachers';
import { SubjectsModule } from '../subjects';

@Module({
  imports: [
    SequelizeModule.forFeature([ClassType, Class, ClassSection, TeacherSpecialization, ClassTeacherAssignment, ClassSubject, Timetable]),
    AcademicYearsModule,
    TeachersModule,
    SubjectsModule,
  ],
  controllers: [ClassTypesController, ClassesController, ClassSectionsController, TeacherSpecializationController, ClassTeacherAssignmentController, ClassSubjectController, TimetableController],
  providers: [ClassTypesService, ClassesService, ClassSectionsService, TeacherSpecializationService, ClassTeacherAssignmentService, ClassSubjectService, TimetableService],
  exports: [ClassTypesService, ClassesService, ClassSectionsService, TeacherSpecializationService, ClassTeacherAssignmentService, ClassSubjectService, TimetableService, SequelizeModule],
})
export class ClassesModule { }
