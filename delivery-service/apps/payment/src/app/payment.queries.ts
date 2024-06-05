import { CheckPayment, PaymentNotify } from '@delivery-service/contracts';
import { HttpService } from '@nestjs/axios';
import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { PaymentRepository } from './payment.repository';

@Controller()
export class PaymentQueries {
  constructor(
    private httpService: HttpService,
    private paymentRepository: PaymentRepository
  ) {}
  @RMQValidate()
  @RMQRoute(PaymentNotify.topic)
  handleYooMoneyNotification(@Body() payload: any) {
    console.log('Received webhook from YooMoney:', payload);
    this.paymentRepository.createPayment(payload);
    return { message: 'Создано' };
  }
  // @RMQValidate()
  // @RMQRoute(PaymentNotify.topic)
  // getAllPayments(@Body() payload: any) {
  //   console.log('Received webhook from YooMoney:', payload);
  //   this.paymentRepository.createPayment(payload);
  //   return { message: 'Создано' };
  // }
  @RMQValidate()
  @RMQRoute(CheckPayment.topic)
  async checkPayment(
    @Body() { paymentId, token }: CheckPayment.Request
  ): Promise<any> {
    const url = `https://api.yoomoney.ru/v1/operation-details`;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    const body = {
      operation_id: paymentId,
    };

    try {
      const response = await this.httpService
        .post(url, body, { headers })
        .toPromise();
      return response.data;
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw new Error('Failed to check payment status');
    }
  }
}
