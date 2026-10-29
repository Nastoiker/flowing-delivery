import { ConfigModule, ConfigService } from '@nestjs/config';
import { IRMQServiceAsyncOptions } from 'nestjs-rmq';

export const getRMQConfig = (): IRMQServiceAsyncOptions => ({
  inject: [ConfigService],
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    exchangeName: configService.get('AMQP_EXCHANGE') ?? '',
    connections: [
      {
        // nestjs-rmq interpolates these fields directly into an AMQP URI.
        login: encodeURIComponent(configService.get('AMQP_USER') ?? ''),
        password: encodeURIComponent(configService.get('AMQP_PASSWORD') ?? ''),
        host: configService.get('AMQP_HOSTNAME') ?? 'rmq',
      },
    ],
    prefetchCount: 32,
    serviceName: 'delivery-account',
  }),
});
