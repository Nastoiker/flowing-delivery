import { AccountUserInfo, AccountUserMe } from '@delivery-service/contracts';
import {
  Controller,
  Get,
  Logger,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RMQService } from 'nestjs-rmq';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../guards/user.decorator';

@Controller('user')
@UseGuards(JWTAuthGuard)
export class UserController {
  constructor(private readonly rmqService: RMQService) {}

  @Post('info')
  async info(@UserId() userId: number) {
    try {
      return await this.rmqService.send<
        AccountUserInfo.Request,
        AccountUserInfo.Response
      >(
        AccountUserInfo.topic,
        { id: userId },
        { headers: { requestId: 'adad' } }
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
  @Get('me')
  async me(@UserId() userId: number) {
    try {
      return await this.rmqService.send<
        AccountUserMe.Request,
        AccountUserMe.Response
      >(
        AccountUserMe.topic,
        { id: userId },
        { headers: { requestId: 'adad' } }
      );
    } catch (e) {
      if (e instanceof Error) {
        console.log(e);
        throw new UnauthorizedException(e.message);
      }
    }
  }
  @Cron('*/5 * * * * *')
  async cron() {
    Logger.log('Done');
  }
}
