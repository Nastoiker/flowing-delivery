import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Payment } from './payment.model';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectModel(Payment)
    private readonly paymentModel: typeof Payment
  ) {}

  async createPayment(payment: any) {
    const paymentCreated = await this.paymentModel.create({
      ...payment,
    });
    if (!paymentCreated) {
      throw new Error('Ошибка создания банера');
    }
    return paymentCreated;
  }

  async findAllBanner() {
    return this.paymentModel.findAll();
  }
}
