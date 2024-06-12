import {
  AccountGetAdminsAll,
  OrderCreate,
  OrderDelete,
  OrderFindById,
  OrderGetAll,
  OrderGetPendingByUserId,
  OrderGetPurchsedByUserId,
  OrderUpdate,
} from '@delivery-service/contracts';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import { CreateOrderDto } from '../dtos/order/OrderCreateDto';
import { UpdateOrderDto } from '../dtos/order/OrderUpdateDto';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../guards/user.decorator';
import { SocketGateway } from '../socket.gateway';
const statusTranslations: { [key: string]: string } = {
  created: 'Создано',
  confirmed: 'Подтверждено',
  delivery: 'Доставляется',
  received: 'Получено',
};
@Controller('order')
export class OrderController {
  constructor(
    private readonly rmqService: RMQService,
    private readonly socketGateway: SocketGateway
  ) {}
  //TODO сделай получение по food и user
  //   @Get('food/:id')
  //   async getOrderByFoodId(@Param('id') id: number) {
  //     try {
  //       const [comments, ratings] = await Promise.all([
  //         this.rmqService.send<
  //           ReviewsCommentsFindByFoodId.Request,
  //           ReviewsCommentsFindByFoodId.Response
  //         >(
  //           ReviewsCommentsFindByFoodId.topic,
  //           { productId: id },
  //           { headers: { requestId: 'adad' } }
  //         ),
  //         this.rmqService.send<
  //           ReviewsRatingsFindByFoodId.Request,
  //           ReviewsRatingsFindByFoodId.Response
  //         >(
  //           ReviewsRatingsFindByFoodId.topic,
  //           { foodId: id },
  //           { headers: { requestId: 'adad' } }
  //         ),
  //       ]);
  //       const data = comments.comments.map((c) =P> ({
  //         ...ratings.ratings.find(
  //           (r) => r.userId === c.userId && r.foodId === c.productId
  //         ),
  //         ...c,
  //       }));
  //       return { reviews: data };
  //     } catch (e) {
  //       if (e instanceof Error) {
  //         throw new UnauthorizedException(e.message);
  //       }
  //     }
  //   }
  //   @Get('user/:id')
  //   async getOrderByUserId(@Param('id') id: number) {
  //     try {
  //       const [ratings, comments] = await Promise.all([
  //         this.rmqService.send<
  //           ReviewsRatingFindByUserId.Request,
  //           ReviewsRatingFindByUserId.Response
  //         >(
  //           ReviewsRatingFindByUserId.topic,
  //           { userId: id },
  //           { headers: { requestId: 'adad' } }
  //         ),
  //         this.rmqService.send<
  //           ReviewsCommentsFindByUserId.Request,
  //           ReviewsCommentsFindByUserId.Response
  //         >(
  //           ReviewsRatingFindByUserId.topic,
  //           { userId: id },
  //           { headers: { requestId: 'adad' } }
  //         ),
  //       ]);
  //       const data = comments.comments.map((c) => ({
  //         ...ratings.ratings.find(
  //           (r) => r.userId === c.userId && r.foodId === c.productId
  //         ),
  //         ...c,
  //       }));
  //       return { reviews: data };
  //     } catch (e) {
  //       if (e instanceof Error) {
  //         throw new UnauthorizedException(e.message);
  //       }
  //     }
  //   }

  @UseGuards(JWTAuthGuard)
  @Get()
  async getOrders(@Query() query) {
    try {
      const {
        sort: { field = 'createdAt', direction = 'desc' },
        filter = {},
        page = 1,
        pageSize = 20,
      } = query || {};
      return await this.rmqService.send<
        OrderGetAll.Request,
        OrderGetAll.Response
      >(
        OrderGetAll.topic,
        { sort: { field, direction }, filter, page, pageSize },
        { headers: { requestId: 'adad' } }
      );
    } catch (e) {
      if (e instanceof Error) {
        console.log('getOrders');
        throw new UnauthorizedException(e.message);
      }
    }
  }
  @UseGuards(JWTAuthGuard)
  @Get('/my-purchased')
  async getPurchasedOrders(@UserId() userId) {
    try {
      // const {
      //   sort: { field = 'createdAt', direction = 'desc' },
      //   filter = {},
      //   page = 1,
      //   pageSize = 20,
      // } = query || {};
      return await this.rmqService.send<
        OrderGetPurchsedByUserId.Request,
        OrderGetPurchsedByUserId.Response
      >(
        OrderGetPurchsedByUserId.topic,
        { userId },
        { headers: { requestId: 'adad' } }
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
  @UseGuards(JWTAuthGuard)
  @Get('/my')
  async getPendingMyOrders(@UserId() userId: number) {
    console.log('my');
    console.log(userId);
    try {
      return await this.rmqService.send<
        OrderGetPendingByUserId.Request,
        OrderGetPendingByUserId.Response
      >(
        OrderGetPendingByUserId.topic,
        { userId },
        { headers: { requestId: 'adad' } }
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
  @UseGuards(JWTAuthGuard)
  @Delete(':id')
  async removeOrder(@Param('id') id: number) {
    try {
      return await this.rmqService.send<
        OrderDelete.Request,
        OrderDelete.Response
      >(OrderDelete.topic, { id }, { headers: { requestId: 'adad' } });
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
  @Put()
  async update(@Body() orderUpdateDto: UpdateOrderDto) {
    try {
      const orderUpdated = await this.rmqService.send<
        OrderUpdate.Request,
        OrderUpdate.Response
      >(OrderUpdate.topic, orderUpdateDto, {
        headers: { requestId: 'adad' },
      });
      if (orderUpdateDto.status) {
        this.socketGateway.sendNewNotification({
          type: 'update-order',
          message: `Изменился статус заявки ${orderUpdateDto.id},\nстатус: ${
            statusTranslations[orderUpdateDto.status]
          }`,
          priority: '1',
          userId: orderUpdated.userId,
        });
      }

      return orderUpdateDto;
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
  @Get(':id')
  async getOrderByFoodId(@Param('id') id: number) {
    try {
      return await this.rmqService.send<
        OrderFindById.Request,
        OrderFindById.Response
      >(OrderFindById.topic, { id }, { headers: { requestId: 'adad' } });
    } catch (e) {
      if (e instanceof Error) {
        console.log('getOrderByFoodId');
        throw new UnauthorizedException(e.message);
      }
    }
  }

  @UseGuards(JWTAuthGuard)
  @Post()
  async create(@UserId() userId: number, @Body() orderDto: CreateOrderDto) {
    try {
      const newOrder = await this.rmqService.send<
        OrderCreate.Request,
        OrderCreate.Response
      >(
        OrderCreate.topic,
        { userId, ...orderDto },
        {
          headers: { requestId: 'adad' },
        }
      );
      const adminIds = await this.rmqService.send<
        AccountGetAdminsAll.Request,
        AccountGetAdminsAll.Response
      >(
        AccountGetAdminsAll.topic,
        {},
        {
          headers: { requestId: 'adad' },
        }
      );
      console.log('sendusers');
      console.log([...adminIds.ids, userId]);
      this.socketGateway.sendNewNotifications({
        type: 'new-order',
        message: `Новая заявка ${newOrder.order.id}`,
        priority: '1',
        userIds: [...new Set([...adminIds.ids, userId])],
      });
      return newOrder;
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
}
