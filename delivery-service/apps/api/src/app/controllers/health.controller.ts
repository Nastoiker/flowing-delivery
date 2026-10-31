import { CategoryGetAll } from '@delivery-service/contracts';
import { Controller, Get, Header, ServiceUnavailableException } from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';

@Controller('health')
export class HealthController {
  private pending?: Promise<boolean>;
  constructor(private readonly rmq: RMQService) {}

  @Get('live')
  @Header('Cache-Control', 'no-store')
  live() { return { status: 'ok' }; }

  @Get('ready')
  @Header('Cache-Control', 'no-store')
  async ready() {
    // Share a pending request: repeated probes must not accumulate RPCs while
    // the broker is unavailable, including time spent in RMQ initialization.
    if (!this.pending) {
      this.pending = this.rmq.send<CategoryGetAll.Request, CategoryGetAll.Response>(
        CategoryGetAll.topic, {}, { timeout: 1500 }
      ).then(reply => Array.isArray(reply?.categories), () => false)
        .finally(() => { this.pending = undefined; });
    }
    let timer: ReturnType<typeof setTimeout>;
    try {
      const available = await Promise.race([
        this.pending,
        new Promise<boolean>(resolve => { timer = setTimeout(() => resolve(false), 2000); }),
      ]);
      if (!available) throw new ServiceUnavailableException({ status: 'unavailable', checks: { checkout: 'down' } });
      return { status: 'ok', checks: { checkout: 'up' } };
    } finally { clearTimeout(timer); }
  }
}
