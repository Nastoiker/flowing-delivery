import { PaymentNotify } from '@delivery-service/contracts';
import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';

@Controller('payments')
export class PaymentController {
  constructor(private readonly rmqService: RMQService) {}

  @Post('notify')
  async initiatePayment(@Body() body) {
    try {
      return await this.rmqService.send<
        PaymentNotify.Request,
        PaymentNotify.Response
      >(
        PaymentNotify.topic,
        {
          sha1_hash: body.sha1_hash,
          datetime: body.datetime,
          sender: body.sender,
          amount: +body.amount,
          operation_id: body.operation_id,
        },
        { headers: { requestId: 'adad' } }
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
}
