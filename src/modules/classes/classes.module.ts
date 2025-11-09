import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClassType } from './entities/class-type.entity';
import { Class } from './entities/class.entity';
import { ClassSection } from './entities/class-section.entity';
import { TeacherSpecialization } from './entities/teacher-specialization.entity';
import { ClassTypesService } from './services/class-types.service';
import { ClassesService } from './services/classes.service';
import { ClassSectionsService } from './services/class-sections.service';
import { TeacherSpecializationService } from './services/teacher-specialization.service';
import { ClassTypesController } from './controllers/class-types.controller';
import { ClassesController } from './controllers/classes.controller';
import { ClassSectionsController } from './controllers/class-sections.controller';
import { TeacherSpecializationController } from './controllers/teacher-specialization.controller';
import { AcademicYearsModule } from '../academic-years';
import { TeachersModule } from '../teachers';
import { SubjectsModule } from '../subjects';

@Module({
  imports: [
    SequelizeModule.forFeature([ClassType, Class, ClassSection, TeacherSpecialization]),
    AcademicYearsModule,
    TeachersModule,
    SubjectsModule,
  ],
  controllers: [ClassTypesController, ClassesController, ClassSectionsController, TeacherSpecializationController],
  providers: [ClassTypesService, ClassesService, ClassSectionsService, TeacherSpecializationService],
  exports: [ClassTypesService, ClassesService, ClassSectionsService, TeacherSpecializationService, SequelizeModule],
})
export class ClassesModule { }
