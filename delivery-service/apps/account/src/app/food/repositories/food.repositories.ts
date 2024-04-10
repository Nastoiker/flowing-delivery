import { Injectable } from '@nestjs/common';

import { IFood } from '@delivery-service/interfaces';
import { InjectModel } from '@nestjs/sequelize';
import { Food } from '../models/food.model';

@Injectable()
export class FoodRepository {
  constructor(@InjectModel(Food) private readonly foodModel: typeof Food) {}

  async createFood(food: IFood) {
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

  async findFood(email: string) {
    return this.foodModel.findOne({ where: { email } });
  }

  async findUserById(id: number) {
    return this.foodModel.findByPk(id);
  }

  async deleteFood(id: number) {
    const food = await this.foodModel.findOne({ where: { id } });
    await food.destroy();
  }
}
