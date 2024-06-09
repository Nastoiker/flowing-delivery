import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Event } from '../model/event.model';

@Injectable()
export class EventRepository {
  constructor(
    @InjectModel(Event)
    private readonly eventModel: typeof Event
  ) {}

  async createEvent(event: any) {
    const categoryCreated = await this.eventModel.create({
      ...event,
    });
    if (!categoryCreated) {
      throw new Error('Ошибка создания банера');
    }
    return categoryCreated;
  }

  async findAllEvent() {
    return this.eventModel.findAll();
  }

  async findEventByType() {
    return this.eventModel.findOne();
  }
}
