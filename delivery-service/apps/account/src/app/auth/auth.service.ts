import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtToken: JwtService) {}

  async register({ email, password, displayName }) {
    return { email: '' };
  }
  async validateUser(email: string, password: string) {
    return { id: '' };
  }
  async login(id: string) {
    return {
      access_token: await this.jwtToken.signAsync({ id }),
    };
  }
}
