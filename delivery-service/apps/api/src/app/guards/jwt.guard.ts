import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JWTAuthGuard implements CanActivate {
  private readonly logger = new Logger(JWTAuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
  ) {}

  canActivate(
    ctx: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = ctx.switchToHttp().getRequest();
    const headers = request.headers;
    if (!headers.authorization) {
      this.logger.log('No authorization header found');
      return false;
    }
    const token = headers.authorization.split(' ')[1] || '';
    try {
      const decodedToken = this.jwtService.verify(token);
      if (!decodedToken.id) {
        return false;
      }
      request.user = decodedToken.id;
      return true;
    } catch (err) {
      this.logger.error('Authenticating user failed', err);
      return false;
    }
  }

  private checkRole(role: number, userAuthorization: number): boolean {
    return (role & userAuthorization) !== 0;
  }
}
