import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AcademicYear } from './entities/academic-year.entity';
import { AcademicYearsService } from './services/academic-years.service';
import { AcademicYearsController } from './controllers/academic-years.controller';

@Module({
  imports: [SequelizeModule.forFeature([AcademicYear])],
  controllers: [AcademicYearsController],
  providers: [AcademicYearsService],
  exports: [AcademicYearsService, SequelizeModule],
})
export class AcademicYearsModule { }
