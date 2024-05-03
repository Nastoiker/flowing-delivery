import { Injectable } from '@nestjs/common';

import { IFood } from '@delivery-service/interfaces';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
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
    return this.foodModel.findOne({ where: { id } });
  }

  async findUserById(id: number) {
    return this.foodModel.findByPk(id);
  }
  async findAllFood() {
    return this.foodModel.findAll();
  }
  async findBySearch(search: string) {
    return this.foodModel.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            description: {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      },
    });
  }
  async deleteFood(id: number) {
    const food = await this.foodModel.findOne({ where: { id } });
    await food.destroy();
  }
}
