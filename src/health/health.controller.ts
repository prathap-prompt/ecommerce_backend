// src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  TypeOrmHealthIndicator,
  HealthCheck,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Check API and database health' })
  check() {
    return this.health.check([
      // Checks the actual TypeORM connection can run a query
      () => this.db.pingCheck('database'),

      // Fails if heap usage exceeds 300MB — catches memory leaks early
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),

      // Fails if disk usage goes above 90% — relevant if you're logging to disk
      () =>
        this.disk.checkStorage('storage', {
          path: '/',
          thresholdPercent: 0.9,
        }),
    ]);
  }

  // A separate, lightweight endpoint some platforms specifically look for
  @Get('liveness')
  @ApiOperation({ summary: 'Basic liveness probe (no DB check)' })
  liveness() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}