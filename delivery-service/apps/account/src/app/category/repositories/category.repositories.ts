import { ICategory } from '@delivery-service/interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Food } from '../../food/models/food.model';
import { Category } from '../model/category.model';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectModel(Category)
    private readonly categoryModel: typeof Category
  ) {}

  async createCategory(category: any) {
    const categoryCreated = await this.categoryModel.create({
      ...category,
    });
    if (!categoryCreated) {
      throw new Error('Ошибка создания категории');
    }
    return categoryCreated;
  }

  async updateCategory({ id, ...rest }: ICategory) {
    const category = await this.categoryModel.update(
      {
        ...rest,
      },
      {
        where: {
          id,
        },
      }
    );

    return category;
  }

  async findCategory(id: number) {
    return this.categoryModel.findOne({ where: { id } });
  }
  async getProductsByCategory(categoryId: number) {
    //{ include: [{ association: 'products'}]}
    return this.categoryModel.findOne({ where: { id: categoryId } });
  }
  async findAllCategory() {
    return this.categoryModel.findAll();
  }
  async findCategoryById(id: number) {
    return this.categoryModel.findByPk(id, { include: [{ model: Food }] });
  }

  async deleteCategory(id: number) {
    const category = await this.categoryModel.findOne({ where: { id } });
    await category.destroy();
  }
}
