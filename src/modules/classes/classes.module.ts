import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClassType } from './entities/class-type.entity';
import { Class } from './entities/class.entity';
import { ClassSection } from './entities/class-section.entity';
import { TeacherSpecialization } from './entities/teacher-specialization.entity';
import { ClassTeacherAssignment } from '../class-sections/entities/class-teacher-assignment.entity';
import { ClassTypesService } from './services/class-types.service';
import { ClassesService } from './services/classes.service';
import { ClassSectionsService } from './services/class-sections.service';
import { TeacherSpecializationService } from './services/teacher-specialization.service';
import { ClassTeacherAssignmentService } from '../class-sections/services/class-teacher-assignment.service';
import { ClassTypesController } from './controllers/class-types.controller';
import { ClassesController } from './controllers/classes.controller';
import { ClassSectionsController } from './controllers/class-sections.controller';
import { TeacherSpecializationController } from './controllers/teacher-specialization.controller';
import { ClassTeacherAssignmentController } from '../class-sections/controllers/class-teacher-assignment.controller';
import { AcademicYearsModule } from '../academic-years';
import { TeachersModule } from '../teachers';
import { SubjectsModule } from '../subjects';

@Module({
  imports: [
    SequelizeModule.forFeature([ClassType, Class, ClassSection, TeacherSpecialization, ClassTeacherAssignment]),
    AcademicYearsModule,
    TeachersModule,
    SubjectsModule,
  ],
  controllers: [ClassTypesController, ClassesController, ClassSectionsController, TeacherSpecializationController, ClassTeacherAssignmentController],
  providers: [ClassTypesService, ClassesService, ClassSectionsService, TeacherSpecializationService, ClassTeacherAssignmentService],
  exports: [ClassTypesService, ClassesService, ClassSectionsService, TeacherSpecializationService, ClassTeacherAssignmentService, SequelizeModule],
})
export class ClassesModule { }
