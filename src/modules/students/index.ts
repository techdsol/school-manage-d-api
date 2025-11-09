// Entities
export { Student } from './entities/student.entity';
export { StudentAssignment } from './entities/student-assignment.entity';

// DTOs
export { CreateStudentDto } from './dto/create-student.dto';
export { UpdateStudentDto } from './dto/update-student.dto';
export { CreateStudentAssignmentDto } from './dto/create-student-assignment.dto';
export { UpdateStudentAssignmentDto } from './dto/update-student-assignment.dto';

// Services
export { StudentsService } from './services/students.service';
export { StudentAssignmentService } from './services/student-assignment.service';

// Controllers
export { StudentsController } from './controllers/students.controller';
export { StudentAssignmentController } from './controllers/student-assignment.controller';

// Module
export { StudentsModule } from './students.module';
