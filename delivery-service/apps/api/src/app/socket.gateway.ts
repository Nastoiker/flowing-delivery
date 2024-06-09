import {
  EventGetUnreadServiceNotifications,
  EventUpdateAllServiceNotifications,
} from '@delivery-service/contracts';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { RMQService } from 'nestjs-rmq';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly rmqService: RMQService,
    private readonly jwtService: JwtService
  ) {}

  @WebSocketServer()
  server: Server;
  private clients = new Map<string, Socket>();

  afterInit() {
    // const middle = WSAuthMiddleware(
    //   this.jwtService,
    //   this.clients,
    //   this.rmqService,
    //   this.authController
    // );
    // this.server.use(middle);
  }

  async handleConnection(socket: Socket) {
    this.hasUnreadNotifications(socket);
  }

  async hasUnreadNotifications(socket: Socket) {
    try {
      const hasUnread = await this.rmqService.send<
        EventGetUnreadServiceNotifications.Request,
        EventGetUnreadServiceNotifications.Response
      >(EventGetUnreadServiceNotifications.topic, socket.data.user);
      socket.emit('hasUnreadNotifications', hasUnread.hasUnreadNotifications);
    } catch (e) {}
  }

  async setUnreadNotifications(
    dto: EventUpdateAllServiceNotifications.Response,
    value: number
  ) {
    const key = `${dto.userId}_${dto.userRole}`;
    const socket = this.clients.get(key);
    if (socket) {
      socket.emit('hasUnreadNotifications', value);
    }
  }

  handleDisconnect(socket: Socket) {
    const key = `${socket.data.user.userId}_${socket.data.user.userRole}`;
    this.clients.delete(key);
  }
}
