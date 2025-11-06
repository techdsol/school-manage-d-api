import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentsService } from './services/students.service';
import { StudentsController } from './controllers/students.controller';
import { Student } from './entities/student.entity';

@Module({
  imports: [SequelizeModule.forFeature([Student])],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule { }
