import { BannerCreate, BannerGetAll } from '@delivery-service/contracts';
import { Body, Controller, Query } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { BannerRepository } from './banner.repository';

@Controller()
export class BannerQueries {
  constructor(private readonly bannerRepository: BannerRepository) {}
  @RMQValidate()
  @RMQRoute(BannerGetAll.topic)
  async getBanners(@Query() query: any): Promise<BannerGetAll.Response> {
    const banner = await this.bannerRepository.findAllBanner();
    return {
      banner,
    };
  }
  @RMQValidate()
  @RMQRoute(BannerCreate.topic)
  async bannerCreate(
    @Body() dto: BannerCreate.Request
  ): Promise<BannerCreate.Response> {
    const banner = await this.bannerRepository.createBanner({ ...dto });
    return {
      banner,
    };
  }
}
