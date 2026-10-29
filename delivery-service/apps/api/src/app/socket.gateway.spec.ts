import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { SocketGateway } from './socket.gateway';
import { WSAuthMiddleware } from './socket.middleware';

function connection(userId?: number) {
  return {
    data: { user: userId ? { userId } : undefined },
    join: jest.fn(),
    disconnect: jest.fn(),
  } as unknown as Socket;
}

describe('Notification delivery', () => {
  it('joins every tab to its authenticated user room', async () => {
    const gateway = new SocketGateway({} as JwtService);
    const first = connection(7);
    const second = connection(7);
    await gateway.handleConnection(first);
    await gateway.handleConnection(second);
    expect(first.join).toHaveBeenCalledWith('user_7');
    expect(second.join).toHaveBeenCalledWith('user_7');
  });

  it('disconnects unauthenticated connections without joining any room', async () => {
    const socket = connection();
    await new SocketGateway({} as JwtService).handleConnection(socket);
    expect(socket.disconnect).toHaveBeenCalledWith(true);
    expect(socket.join).not.toHaveBeenCalled();
  });

  it('deduplicates recipients and sends one structured event only to their rooms', () => {
    const emit = jest.fn();
    const to = jest.fn(() => ({ emit }));
    const gateway = new SocketGateway({} as JwtService);
    gateway.server = { to } as unknown as Server;
    gateway.sendNewNotifications({
      userIds: [7, 7, 9, -1, NaN],
      message: 'Заказ создан',
      type: 'new-order',
      priority: '1',
    });
    expect(to).toHaveBeenCalledWith(['user_7', 'user_9']);
    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith(
      'newNotification',
      expect.objectContaining({
        id: expect.any(String),
        createdAt: expect.any(String),
        message: 'Заказ создан',
        type: 'new-order',
      })
    );
    expect(Number.isFinite(Date.parse(emit.mock.calls[0][1].createdAt))).toBe(
      true
    );
  });

  it('does not broadcast when there are no valid recipients', () => {
    const to = jest.fn();
    const gateway = new SocketGateway({} as JwtService);
    gateway.server = { to } as unknown as Server;
    gateway.sendNewNotifications({
      userIds: [],
      message: 'Private',
      type: 'info',
      priority: '1',
    });
    expect(to).not.toHaveBeenCalled();
  });
});

describe('WebSocket authentication', () => {
  it('uses the verified identity, not client supplied userId', () => {
    const verify = jest.fn(() => ({ id: 7 }));
    const socket = {
      handshake: { auth: { token: 'signed', userId: 99 } },
      data: {},
    } as unknown as Socket;
    const next = jest.fn();
    new WSAuthMiddleware({ verify } as unknown as JwtService).use(socket, next);
    expect(socket.data.user).toEqual({ userId: 7 });
    expect(next).toHaveBeenCalledWith();
  });

  it.each([undefined, '', ['token']])(
    'rejects an invalid token input %p',
    (token) => {
      const verify = jest.fn();
      const next = jest.fn();
      new WSAuthMiddleware({ verify } as unknown as JwtService).use(
        { handshake: { auth: { token } }, data: {} } as unknown as Socket,
        next
      );
      expect(verify).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    }
  );

  it('does not expose verification details', () => {
    const next = jest.fn();
    const verify = () => {
      throw new Error('internal verification details');
    };
    new WSAuthMiddleware({ verify } as unknown as JwtService).use(
      {
        handshake: { auth: { token: 'expired' } },
        data: {},
      } as unknown as Socket,
      next
    );
    expect(next.mock.calls[0][0].message).toBe('Authentication failed');
  });
});
