import { Injectable } from '@nestjs/common';

import { IFood } from '@delivery-service/interfaces';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Comment } from '../../comments/comment.model';
import { Rating } from '../../rating/rating.model';
import { User } from '../../user/models/user.model';
import { Food } from '../models/food.model';
@Injectable()
export class FoodRepository {
  constructor(@InjectModel(Food) private readonly foodModel: typeof Food) {}

  async createFood(food: any) {
    const foodCreated = await this.foodModel.create({
      ...food,
    });
    if (!foodCreated) {
      throw new Error('Ошибка создания пользователя');
    }
    return foodCreated;
  }

  async updateFOod({ id, ...rest }: IFood) {
    const food = await this.foodModel.update(
      {
        ...rest,
      },
      {
        where: {
          id,
        },
      }
    );

    return food;
  }

  async findFood(id: number) {
    return this.foodModel.findOne({
      where: { id },
      include: [
        {
          model: Rating,
          include: [
            {
              model: User,
            },
          ],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
            },
          ],
        },
      ],
    });
  }
  async findAllFood() {
    return this.foodModel.findAll({
      include: [
        {
          model: Rating,
        },
        {
          model: Comment,
        },
      ],
    });
  }
  async findBySearch(search: string) {
    return this.foodModel.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            description: {
              [Op.iLike]: `%${search}%`,
            },
          },
        ],
      },
      include: [
        {
          model: Rating,
          include: [
            {
              model: User,
            },
          ],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
            },
          ],
        },
      ],
    });
  }
  async deleteFood(id: number) {
    const food = await this.foodModel.findOne({ where: { id } });
    await food.destroy();
  }
}
