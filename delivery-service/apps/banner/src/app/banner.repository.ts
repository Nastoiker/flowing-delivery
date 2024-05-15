import { ICategory } from '@delivery-service/interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Banner } from './banner.model';

@Injectable()
export class BannerRepository {
  constructor(
    @InjectModel(Banner)
    private readonly bannerModel: typeof Banner
  ) {}

  async createBanner(banner: any) {
    const categoryCreated = await this.bannerModel.create({
      ...banner,
    });
    if (!categoryCreated) {
      throw new Error('Ошибка создания банера');
    }
    return categoryCreated;
  }

  async updateCategory({ id, ...rest }: ICategory) {
    const category = await this.bannerModel.update(
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

  async findAllBanner() {
    return this.bannerModel.findAll();
  }

  async deleteCategory(id: number) {
    const category = await this.bannerModel.findOne({ where: { id } });
    await category.destroy();
  }
}
