import { EventCreate, EventGetAll } from '@delivery-service/contracts';
import { Body, Controller, Query } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { EventRepository } from './repositories/event.repositories';

@Controller()
export class EventQueries {
  constructor(private readonly eventRepository: EventRepository) {}
  @RMQValidate()
  @RMQRoute(EventGetAll.topic)
  async getEvents(@Query() query: any): Promise<EventGetAll.Response> {
    const events = await this.eventRepository.findAllEvent();
    return {
      events,
    };
  }
  @RMQValidate()
  @RMQRoute(EventCreate.topic)
  async eventCreate(
    @Body() dto: EventCreate.Request
  ): Promise<EventCreate.Response> {
    const event = await this.eventRepository.createEvent({ ...dto });
    return {
      event,
    };
  }
}
