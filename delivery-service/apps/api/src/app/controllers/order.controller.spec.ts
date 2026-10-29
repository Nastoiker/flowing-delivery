import { Logger } from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import { SocketGateway } from '../socket.gateway';
import { CreateOrderDto } from '../dtos/order/OrderCreateDto';
import { OrderController } from './order.controller';

describe('Результат оформления и уведомления', () => {
  afterEach(() => jest.restoreAllMocks());

  it('ошибка поиска администраторов не отменяет созданный заказ', async () => {
    const response = { order: { id: 10, userId: 7 } };
    const send = jest
      .fn()
      .mockResolvedValueOnce(response)
      .mockRejectedValueOnce(new Error('Брокер недоступен'));
    const notify = jest.fn();
    jest.spyOn(Logger, 'warn').mockImplementation(() => undefined);
    const controller = new OrderController(
      { send } as unknown as RMQService,
      { sendNewNotifications: notify } as unknown as SocketGateway
    );
    const dto = { userId: 999, deliveryPrice: 0 } as CreateOrderDto;
    await expect(controller.create(7, dto)).resolves.toEqual(response);
    expect(send.mock.calls[0][1].userId).toBe(7);
    expect(notify).not.toHaveBeenCalled();
  });

  it('ошибка WebSocket после фиксации не превращает успех в отказ', async () => {
    const response = { order: { id: 10, userId: 7 } };
    const send = jest
      .fn()
      .mockResolvedValueOnce(response)
      .mockResolvedValueOnce({ ids: [1] });
    jest.spyOn(Logger, 'warn').mockImplementation(() => undefined);
    const controller = new OrderController(
      { send } as unknown as RMQService,
      {
        sendNewNotifications: () => {
          throw new Error('Сбой отправки');
        },
      } as unknown as SocketGateway
    );
    await expect(controller.create(7, {} as CreateOrderDto)).resolves.toEqual(
      response
    );
  });

  it('при ошибке создания не пытается отправить уведомление об успехе', async () => {
    const send = jest
      .fn()
      .mockRejectedValueOnce(new Error('Недостаточно товара'));
    const notify = jest.fn();
    const controller = new OrderController(
      { send } as unknown as RMQService,
      { sendNewNotifications: notify } as unknown as SocketGateway
    );
    await expect(controller.create(7, {} as CreateOrderDto)).rejects.toThrow(
      'Недостаточно'
    );
    expect(send).toHaveBeenCalledTimes(1);
    expect(notify).not.toHaveBeenCalled();
  });
});
