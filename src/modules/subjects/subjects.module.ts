import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Subject } from './entities/subject.entity';
import { SubjectsService } from './services/subjects.service';
import { SubjectsController } from './controllers/subjects.controller';

@Module({
  imports: [SequelizeModule.forFeature([Subject])],
  controllers: [SubjectsController],
  providers: [SubjectsService],
  exports: [SubjectsService, SequelizeModule],
})
export class SubjectsModule { }
