import { Injectable } from '@nestjs/common';

import { IUser } from '@delivery-service/interfaces';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
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

  async updateUser({ id, ...rest }: Partial<IUser>) {
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
  async getAllUsers({ sort, filter, page, pageSize }) {
    const { field = 'createdAt', direction = 'desc' } = sort || {};
    const { phone, surname, status, search } = filter;
    const offset = (page - 1) * pageSize;
    const where = {
      ...(search && {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            email: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            surname: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            username: {
              [Op.iLike]: `%${search}%`,
            },
          },
        ],
      }),
    } as any;
    if (status !== undefined) where.status = status;
    const users = await this.userModel.findAll({
      order: [[field, direction]],
      where,
      attributes: { exclude: ['password'] },
    });
    const allCount = await this.userModel.count({
      where,
      attributes: { exclude: ['password'] },
    });
    return { users, allCount };
  }
  async me(id: number) {
    return this.userModel.findByPk(id, { include: ['shoppingCart'] });
  }
  async findUserById(id: number) {
    return this.userModel.findByPk(id);
  }

  async deleteUser(email: string) {
    const user = await this.userModel.findOne({ where: { email } });
    await user.destroy();
  }
}
