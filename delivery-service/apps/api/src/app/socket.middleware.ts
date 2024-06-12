import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction } from 'express';
import { Socket } from 'socket.io';

@Injectable()
export class WSAuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(socket: Socket, next: NextFunction) {
    //@ts-ignore
    const token = socket.handshake.query.token;
    if (!token) {
      console.log('ebal1');

      return next(new Error('Authentication error: Token is required'));
    }

    try {
      //@ts-ignore
      const decoded = this.jwtService.verify(token);
      if (decoded && decoded.id) {
        // Формируем уникальный ключ для сокета
        const socketKey = `user_${decoded.id}`;
        socket.data.user = { userId: decoded.id };
        socket.data.key = socketKey; // Сохраняем ключ в данные сокета
        next();
      } else {
        console.log(JSON.stringify(decoded));
        console.log('Authentication error: Invalid token');
        next(new Error('Authentication error: Invalid token'));
      }
    } catch (error) {
      next(new Error('Authentication error: ' + error.message));
    }
  }
}
