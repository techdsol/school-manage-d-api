import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClassType } from './entities/class-type.entity';
import { Class } from './entities/class.entity';
import { ClassTypesService } from './services/class-types.service';
import { ClassesService } from './services/classes.service';
import { ClassTypesController } from './controllers/class-types.controller';
import { ClassesController } from './controllers/classes.controller';

@Module({
  imports: [SequelizeModule.forFeature([ClassType, Class])],
  controllers: [ClassTypesController, ClassesController],
  providers: [ClassTypesService, ClassesService],
  exports: [ClassTypesService, ClassesService, SequelizeModule],
})
export class ClassesModule { }
