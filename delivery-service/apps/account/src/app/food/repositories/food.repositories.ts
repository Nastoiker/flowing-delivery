import { Injectable } from '@nestjs/common';

import { IFood } from '@delivery-service/interfaces';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Category } from '../../category/model/category.model';
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

  async updateFood({ id, ...rest }: IFood) {
    const food = await this.foodModel.findByPk(id);
    if (!food) {
      throw new Error('Еда не найдена');
    }
    await food.update({
      ...rest,
    });

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
  async findAllFood({ sort, filter, page, pageSize }) {
    const { field = 'createdAt', direction = 'desc' } = sort || {};
    const {
      minPrice,
      maxPrice,
      categoryId,
      calories,
      grams,
      search,
      minCalories,
      maxCalories,
    } = filter;
    const offset = (page - 1) * pageSize;
    const where = {
      ...(search && {
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
      }),
    } as any;
    if (minPrice !== undefined)
      where.price = { ...where.price, [Op.gte]: minPrice };
    if (maxPrice !== undefined)
      where.price = { ...where.price, [Op.lte]: maxPrice };
    if (minCalories !== undefined)
      where.calories = { ...where.calories, [Op.gte]: minCalories };
    if (maxCalories !== undefined)
      where.calories = { ...where.calories, [Op.lte]: maxCalories };
    if (categoryId !== undefined) where.categoryId = categoryId;
    if (calories !== undefined) where.calories = calories;
    if (grams !== undefined) where.grams = grams;
    return this.foodModel.findAndCountAll({
      order: [[field, direction]],
      where,
      offset,
      limit: pageSize,
      include: [
        {
          model: Rating,
        },
        {
          model: Category,
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
