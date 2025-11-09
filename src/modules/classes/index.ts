// Entities
export { ClassType } from './entities/class-type.entity';
export { Class } from './entities/class.entity';
export { ClassSection } from './entities/class-section.entity';
export { TeacherSpecialization } from './entities/teacher-specialization.entity';

// DTOs
export { CreateClassTypeDto } from './dto/create-class-type.dto';
export { UpdateClassTypeDto } from './dto/update-class-type.dto';
export { CreateClassDto } from './dto/create-class.dto';
export { UpdateClassDto } from './dto/update-class.dto';
export { CreateClassSectionDto } from './dto/create-class-section.dto';
export { UpdateClassSectionDto } from './dto/update-class-section.dto';
export { CreateTeacherSpecializationDto } from './dto/create-teacher-specialization.dto';
export { UpdateTeacherSpecializationDto } from './dto/update-teacher-specialization.dto';

// Services
export { ClassTypesService } from './services/class-types.service';
export { ClassesService } from './services/classes.service';
export { ClassSectionsService } from './services/class-sections.service';
export { TeacherSpecializationService } from './services/teacher-specialization.service';

// Controllers
export { ClassTypesController } from './controllers/class-types.controller';
export { ClassesController } from './controllers/classes.controller';
export { ClassSectionsController } from './controllers/class-sections.controller';
export { TeacherSpecializationController } from './controllers/teacher-specialization.controller';

// Module
export { ClassesModule } from './classes.module';
