import {
  AccountGetAll,
  AccountUpdate,
  AccountUpdateUser,
  AccountUserInfo,
  AccountUserMe,
} from '@delivery-service/contracts';
import { IUser } from '@delivery-service/interfaces';
import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
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
  @Put()
  async updateMe(@UserId() userId: number, @Body() updateDto: Partial<IUser>) {
    try {
      return await this.rmqService.send<
        AccountUpdate.Request,
        AccountUpdate.Response
      >(
        AccountUpdate.topic,
        { user: { id: userId, ...updateDto } },
        { headers: { requestId: 'adad' } }
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() updateDto: Partial<IUser>) {
    try {
      return await this.rmqService.send<
        AccountUpdateUser.Request,
        AccountUpdateUser.Response
      >(
        AccountUpdateUser.topic,
        { user: { id, ...updateDto } },
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
  @Get()
  async users(@Query() query) {
    try {
      const {
        sort: { field = 'createdAt', direction = 'desc' },
        filter = {},
        page = 1,
        pageSize = 20,
      } = query;
      return await this.rmqService.send<
        AccountGetAll.Request,
        AccountGetAll.Response
      >(
        AccountGetAll.topic,
        { sort: { field, direction }, filter, page, pageSize },
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
