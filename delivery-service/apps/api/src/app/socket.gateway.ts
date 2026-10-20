import {
  EventAddServiceNotification,
  EventAddServiceNotifications,
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
import { WSAuthMiddleware } from './socket.middleware';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
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
  // РЕВЬЮ R9: Map локален процессу и хранит только одно соединение пользователя.
  // Оставляем одну реплику API до поддержки нескольких соединений и доставки между репликами.
  private clients = new Map<string, Socket>();

  // afterInit() {
  //   // const middle = WSAuthMiddleware(
  //   //   this.jwtService,
  //   //   this.clients,
  //   //   this.rmqService,
  //   //   this.authController
  //   // );
  //   // this.server.use(middle);
  // }
  afterInit(server: Server) {
    const authMiddleware = new WSAuthMiddleware(this.jwtService);
    server.use(authMiddleware.use.bind(authMiddleware));
  }
  async handleConnection(socket: Socket) {
    if (!socket.data.user) {
      console.log(`Authentication failed, disconnecting socket.`);
      socket.disconnect();
      return;
    }
    const socketKey = `user_${socket.data.user.userId}`;

    this.clients.set(socketKey, socket);
    console.log(
      `Current connected clients: ${Array.from(this.clients.keys())}`
    );
    socket.on('disconnect', () => {
      this.clients.delete(socketKey);
    });
  }
  sendNewNotification(dto: EventAddServiceNotification.Request) {
    const key = `user_${dto.userId}`;

    const socket = this.clients.get(key);
    if (socket) {
      console.log('emit', dto.message);
      socket.emit('newNotification', dto.message);
      socket.emit('hasUnreadNotifications', 1);
    }
  }
  sendNewNotifications(dto: EventAddServiceNotifications.Request) {
    dto.userIds.map((id) => {
      const key = `user_${id}`;
      const socket = this.clients.get(key);
      if (socket) {
        socket.emit('newNotification', dto.message);
      }
    });
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
    // const key = `${dto.userId}_${dto.userRole}`;
    // const socket = this.clients.get(key);
    // if (socket) {
    //   socket.emit('hasUnreadNotifications', value);
    // }
  }

  handleDisconnect(socket: Socket) {
    const key = `user_${socket.data.user.userId}`;
    this.clients.delete(key);
  }
}
