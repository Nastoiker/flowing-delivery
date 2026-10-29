import { ConfigService } from '@nestjs/config';
import { RMQService } from 'nestjs-rmq';
import { getRMQConfig as api } from './rmg.config';
import { getRMQConfig as account } from '../../../../account/src/app/configs/rmq.config';
import { getRMQConfig as banner } from '../../../../banner/src/app/configs/rmq.config';
import { getRMQConfig as event } from '../../../../event/src/app/configs/rmq.config';
import { getRMQConfig as payment } from '../../../../payment/src/app/configs/rmq.config';
import { getRMQConfig as chat } from '../../../../chat/src/app/configs/rmq.config';
import { getRMQConfig as file } from '../../../../file/src/app/configs/rmq.config';

describe.each([api, account, banner, event, payment, chat, file])(
  'RMQ URI configuration %#',
  (factory) => {
    it('round trips reserved characters through the installed nestjs-rmq URI builder', async () => {
      const login = 'delivery@lab';
      const password = 'a/b+c==:@#?%';
      const options = await factory().useFactory(
        new ConfigService({
          AMQP_USER: login,
          AMQP_PASSWORD: password,
          AMQP_HOSTNAME: 'rabbitmq',
        })
      );
      // Deliberately exercise the dependency boundary which caused the startup bug.
      const builder = RMQService.prototype as unknown as {
        createConnectionUri(connection: unknown): string;
      };
      const uri = new URL(builder.createConnectionUri(options.connections[0]));
      expect(uri.hostname).toBe('rabbitmq');
      expect(decodeURIComponent(uri.username)).toBe(login);
      expect(decodeURIComponent(uri.password)).toBe(password);
      expect(uri.hash).toBe('');
      expect(uri.search).toBe('');
    });
  }
);
