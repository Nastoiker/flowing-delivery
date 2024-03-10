import { Controller, Post } from '@nestjs/common';


@Controller('auth')
export class AuthController {
  constructor() {}

  @Post('register')
  async register() {
    
  }
}
