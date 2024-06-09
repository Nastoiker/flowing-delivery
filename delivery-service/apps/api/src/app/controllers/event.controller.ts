import { EventCreate, EventGetAll } from '@delivery-service/contracts';
import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';

@Controller('events')
export class EventController {
  constructor(private readonly rmqService: RMQService) {}

  @Get()
  async getEvents() {
    try {
      return await this.rmqService.send<
        EventGetAll.Request,
        EventGetAll.Response
      >(EventGetAll.topic, {}, { headers: { requestId: 'adad' } });
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
  @Post('create')
  async createEvent(@Body() createEvent: any) {
    try {
      return await this.rmqService.send<
        EventCreate.Request,
        EventCreate.Response
      >(EventCreate.topic, createEvent, { headers: { requestId: 'adad' } });
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
}
