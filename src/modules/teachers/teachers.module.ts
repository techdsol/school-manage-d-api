import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TeachersService } from './services/teachers.service';
import { TeachersController } from './controllers/teachers.controller';
import { Teacher } from './entities/teacher.entity';

@Module({
  imports: [SequelizeModule.forFeature([Teacher])],
  controllers: [TeachersController],
  providers: [TeachersService],
  exports: [TeachersService],
})
export class TeachersModule { }
