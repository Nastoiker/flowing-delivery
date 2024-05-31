import { AccountRegister } from '@delivery-service/contracts';
import { UserRole } from '@delivery-service/interfaces';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/entities/user.entity';
import { UserRepository } from '../user/repositories/user.repositories';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtToken: JwtService
  ) {}

  async register({
    email,
    password,
    displayName,
    name,
    surname,
    username,
  }: AccountRegister.Request) {
    const oldUser = await this.userRepository.findUser(email);
    if (oldUser) {
      throw new Error('Такой пользователь уже существует');
    }
    const userEntity = await new UserEntity({
      displayName,
      email,
      roles: UserRole.buyer,
      password: '',
      status: 'new',
      name,
      surname,
      username,
    }).setPassword(password);
    const newUser = await this.userRepository.createUser({
      status: 'status',
      email,
      roles: userEntity.roles,
      password: userEntity.password,
      name,
      surname,
      username,
    });
    return { email: newUser.email };
  }
  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findUser(email);
    if (!user) {
      throw new Error('Неверный логин или пароль');
    }
    const userEntity = new UserEntity(user);
    const isCorrectPassword = await userEntity.PasswordValidate(password);
    if (!isCorrectPassword) {
      throw new Error('Неверный пароль или логин');
    }
    if (user.status === 'banned') {
      throw new Error('К сожалению, вы забанены');
    }
    return { id: user.id };
  }
  async login(id: number) {
    return {
      access_token: await this.jwtToken.signAsync({ id }),
    };
  }
}
