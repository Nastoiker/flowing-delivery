
import { Injectable } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AuthService {
  constructor(
              private readonly  jwtToken: JwtService) {}

  async register({email, password, displayName}:) {
  

    return { };
  }
  async validateUser(email: string, password: string) {
   
    return {};
  }
  async login(id: string) {
    return {
      access_token: await this.jwtToken.signAsync({id})
    }
  }
}