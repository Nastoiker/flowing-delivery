import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class WSAuthMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(socket: Socket, next: (error?: Error) => void) {
    const token = socket.handshake.auth?.token;
    if (typeof token !== 'string' || !token) {
      next(new Error('Authentication required'));
      return;
    }
    try {
      const decoded = this.jwtService.verify(token);
      if (!Number.isSafeInteger(decoded?.id) || decoded.id <= 0) {
        throw new Error('Invalid identity');
      }
      socket.data.user = { userId: decoded.id };
    } catch {
      next(new Error('Authentication failed'));
      return;
    }
    next();
  }
}
