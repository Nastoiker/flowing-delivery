import {
  EventAddServiceNotification,
  EventAddServiceNotifications,
} from '@delivery-service/contracts';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { randomUUID } from 'node:crypto';
import { Server, Socket } from 'socket.io';
import { WSAuthMiddleware } from './socket.middleware';

@Injectable()
@WebSocketGateway({
  cors: { origin: 'http://localhost:5173', credentials: true },
})
export class SocketGateway implements OnGatewayConnection {
  constructor(private readonly jwtService: JwtService) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    const middleware = new WSAuthMiddleware(this.jwtService);
    server.use(middleware.use.bind(middleware));
  }

  async handleConnection(socket: Socket) {
    const id = socket.data.user?.userId;
    if (!Number.isSafeInteger(id) || id <= 0) {
      socket.disconnect(true);
      return;
    }
    // Socket.IO removes only this connection from the room on disconnect.
    await socket.join(`user_${id}`);
  }

  sendNewNotification(dto: EventAddServiceNotification.Request) {
    this.sendNewNotifications({ ...dto, userIds: [dto.userId] });
  }

  sendNewNotifications(dto: EventAddServiceNotifications.Request) {
    const ids = [...new Set(dto.userIds)].filter(
      (id) => Number.isSafeInteger(id) && id > 0
    );
    if (!ids.length || !dto.message?.trim()) return;
    this.server.to(ids.map((id) => `user_${id}`)).emit('newNotification', {
      id: randomUUID(),
      type: dto.type || 'info',
      message: dto.message,
      createdAt: new Date().toISOString(),
    });
  }
}
