import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (configService: ConfigService): SequelizeModuleOptions => {
  const config = {
    dialect: 'mysql' as const,
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 3306),
    username: configService.get<string>('DB_USERNAME', 'root'),
    password: configService.get<string>('DB_PASSWORD', ''),
    database: configService.get<string>('DB_NAME', 'school_management'),
    autoLoadModels: true,
    synchronize: true,
    sync: { force: false, alter: true },
    logging: configService.get<string>('NODE_ENV') === 'development' ? console.log : false,
  };

  console.log('Database config:', {
    ...config,
    password: config.password ? '***' : 'NO PASSWORD SET',
  });

  return config;
};
