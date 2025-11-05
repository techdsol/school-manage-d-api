import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  private readonly startTime: Date;

  constructor() {
    this.startTime = new Date();
  }

  async isHealthy(key: string): Promise<any> {
    // Custom health check logic
    // You can add database connectivity checks, external service checks, etc.
    return {
      [key]: {
        status: 'up',
        message: 'Application is running smoothly',
        timestamp: new Date().toISOString(),
      },
    };
  }

  getSimpleStatus() {
    const uptime = process.uptime();

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: uptime,
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
    };
  }
}