import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { HealthModule } from './modules/health';
import { StudentsModule } from './modules/students';
import { TeachersModule } from './modules/teachers';
import { ClassesModule } from './modules/classes';
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
