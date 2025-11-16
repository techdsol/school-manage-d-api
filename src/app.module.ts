import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { HealthModule } from './modules/health';
import { StudentsModule } from './modules/students';
import { TeachersModule } from './modules/teachers';
import { ClassesModule } from './modules/classes';
import { SubjectsModule } from './modules/subjects';
import { AcademicYearsModule } from './modules/academic-years';
import { PaymentsModule } from './modules/payments/payments.module';
import { TimetableModule } from './modules/timetable';
import { getDatabaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getDatabaseConfig(configService),
    }),
    HealthModule,
    StudentsModule,
    TeachersModule,
    ClassesModule,
    SubjectsModule,
    AcademicYearsModule,
    PaymentsModule,
    TimetableModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
