import { Injectable } from '@nestjs/common';

import { IUser } from '@delivery-service/interfaces';
import { InjectModel } from '@nestjs/sequelize';
import { UserEntity } from '../entities/user.entity';
import { User } from '../models/user.model';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  async createUser(user: IUser) {
    const userCreated = await this.userModel.create({
      ...user,
    });
    if (!userCreated) {
      throw new Error('Ошибка создания пользователя');
    }
    return userCreated;
  }

  async updateUser({ id, ...rest }: UserEntity) {
    const user = await this.userModel.update(
      {
        ...rest,
      },
      {
        where: {
          id,
        },
      }
    );

    return user;
  }

  async findUser(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

  async findUserById(id: number) {
    return this.userModel.findByPk(id);
  }

  async deleteUser(email: string) {
    const user = await this.userModel.findOne({ where: { email } });
    await user.destroy();
  }
}
