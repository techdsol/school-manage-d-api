import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Timetable } from './entities/timetable.entity';
import { TimetableService } from './services/timetable.service';
import { TimetableController } from './controllers/timetable.controller';
import { ClassesModule } from '../classes';
import { SubjectsModule } from '../subjects';
import { TeachersModule } from '../teachers';

@Module({
  imports: [
    SequelizeModule.forFeature([Timetable]),
    ClassesModule, // For ClassSection entity
    SubjectsModule, // For Subject entity
    TeachersModule, // For Teacher entity
  ],
  controllers: [TimetableController],
  providers: [TimetableService],
  exports: [TimetableService, SequelizeModule],
})
export class TimetableModule { }
