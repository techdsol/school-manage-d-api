import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from '../../../../../src/modules/health/services/health.service';

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthService],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isHealthy', () => {
    it('should return health status for application', async () => {
      const result = await service.isHealthy('application');
      expect(result).toHaveProperty('application');
      expect(result.application).toHaveProperty('status', 'up');
      expect(result.application).toHaveProperty('message');
      expect(result.application).toHaveProperty('timestamp');
    });
  });

  describe('getSimpleStatus', () => {
    it('should return simple status with required properties', () => {
      const result = service.getSimpleStatus();
      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
      expect(result).toHaveProperty('environment');
      expect(result).toHaveProperty('version');
    });
  });
});
