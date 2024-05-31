import {
  ReviewAllComments,
  ReviewAllRatings,
  ReviewCommentCreate,
  ReviewCommentRemove,
  ReviewCommentUpdate,
  ReviewRatingCreate,
  ReviewRatingUpdate,
  ReviewsCommentsFindByFoodId,
  ReviewsCommentsFindByUserId,
  ReviewsRatingFindByUserId,
  ReviewsRatingsFindByFoodId,
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
import { CommentCreateDto } from '../dtos/review/comment.create-dto';
import { CommentUpdateDto } from '../dtos/review/comment.update-dto';
import { RatingCreateDto } from '../dtos/review/rating.create-dto';
import { RatingUpdateDto } from '../dtos/review/rating.update-dto';
import { FilesService } from '../file.service';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../guards/user.decorator';

@Controller('review')
export class ReviewController {
  constructor(
    private readonly rmqService: RMQService,
    private readonly filesService: FilesService
  ) {}
  @UseGuards(JWTAuthGuard)
  @Get('all-reviews')
  async getAllReviews(@Query() query) {
    const {
      sort: { field = 'createdAt', direction = 'desc' },
      filter = {},
      page = 1,
      pageSize = 20,
    } = query || {};
    try {
      const [ratings, { comments, allCount }] = await Promise.all([
        this.rmqService.send<
          ReviewAllRatings.Request,
          ReviewAllRatings.Response
        >(
          ReviewAllRatings.topic,
          { sort: { field, direction }, filter },
          { headers: { requestId: 'adad' } }
        ),
        this.rmqService.send<
          ReviewAllComments.Request,
          ReviewAllComments.Response
        >(
          ReviewAllComments.topic,
          { sort: { field, direction }, pageSize, page, filter },
          { headers: { requestId: 'adad' } }
        ),
      ]);
      const data = comments.map((c) => ({
        ...ratings.ratings.find(
          (r) => r.userId === c.user.id && r.foodId === c.product.id
        ),
        ...c,
      }));
      return { reviews: data, allCount };
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
  @Get('food/:id')
  async getReviewByFoodId(@Param('id') id: number, @Query() query) {
    try {
      const {
        sort: { field = 'createdAt', direction = 'desc' },
      } = query || {};
      const [comments, ratings] = await Promise.all([
        this.rmqService.send<
          ReviewsCommentsFindByFoodId.Request,
          ReviewsCommentsFindByFoodId.Response
        >(
          ReviewsCommentsFindByFoodId.topic,
          { productId: id, sort: { field, direction } },
          { headers: { requestId: 'adad' } }
        ),
        this.rmqService.send<
          ReviewsRatingsFindByFoodId.Request,
          ReviewsRatingsFindByFoodId.Response
        >(
          ReviewsRatingsFindByFoodId.topic,
          { foodId: id },
          { headers: { requestId: 'adad' } }
        ),
      ]);
      const data = comments.comments.map((c) => ({
        ...ratings.ratings.find(
          (r) => r.userId === c.userId && r.foodId === c.productId
        ),
        ...c,
      }));
      return { reviews: data };
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }

  @Get('user/:id')
  async getReviewByUserId(@Param('id') id: number) {
    try {
      const [ratings, comments] = await Promise.all([
        this.rmqService.send<
          ReviewsRatingFindByUserId.Request,
          ReviewsRatingFindByUserId.Response
        >(
          ReviewsRatingFindByUserId.topic,
          { userId: id },
          { headers: { requestId: 'adad' } }
        ),
        this.rmqService.send<
          ReviewsCommentsFindByUserId.Request,
          ReviewsCommentsFindByUserId.Response
        >(
          ReviewsCommentsFindByUserId.topic,
          { userId: id },
          { headers: { requestId: 'adad' } }
        ),
      ]);
      const data = comments.comments.map((c) => ({
        ...ratings.ratings.find(
          (r) => r.userId === c.userId && r.foodId === c.productId
        ),
        ...c,
      }));
      return { reviews: data };
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }

  @UseGuards(JWTAuthGuard)
  @Get('my-reviews')
  async getMyReviews(@UserId() id: number) {
    try {
      const [ratings, comments] = await Promise.all([
        this.rmqService.send<
          ReviewsRatingFindByUserId.Request,
          ReviewsRatingFindByUserId.Response
        >(
          ReviewsRatingFindByUserId.topic,
          { userId: id },
          { headers: { requestId: 'adad' } }
        ),
        this.rmqService.send<
          ReviewsCommentsFindByUserId.Request,
          ReviewsCommentsFindByUserId.Response
        >(
          ReviewsCommentsFindByUserId.topic,
          { userId: id },
          { headers: { requestId: 'adad' } }
        ),
      ]);
      const data = comments.comments.map((c) => ({
        ...ratings.ratings.find(
          (r) => r.userId === c.userId && r.foodId === c.productId
        ),
        ...c,
      }));
      return { reviews: data };
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
  @UseGuards(JWTAuthGuard)
  @Delete('comment/:id')
  async removeReviewComment(@Param('id') id: number) {
    try {
      return await this.rmqService.send<
        ReviewCommentRemove.Request,
        ReviewCommentRemove.Response
      >(ReviewCommentRemove.topic, { id }, { headers: { requestId: 'adad' } });
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
  @Put('comment')
  async reviewCommentUpdate(@Body() reviewCommentDto: CommentUpdateDto) {
    try {
      return await this.rmqService.send<
        ReviewCommentUpdate.Request,
        ReviewCommentUpdate.Response
      >(ReviewCommentUpdate.topic, reviewCommentDto, {
        headers: { requestId: 'adad' },
      });
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
  @UseGuards(JWTAuthGuard)
  @Put('rating')
  async reviewRatingUpdate(
    @UserId() userId: number,
    @Body() ratingDto: RatingUpdateDto
  ) {
    try {
      return await this.rmqService.send<
        ReviewRatingUpdate.Request,
        ReviewRatingUpdate.Response
      >(
        ReviewRatingUpdate.topic,
        { userId, ...ratingDto },
        {
          headers: { requestId: 'adad' },
        }
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
  @UseGuards(JWTAuthGuard)
  @Post('comment')
  async createComment(
    @UserId() userId: number,
    @Body() reviewDto: CommentCreateDto
  ) {
    try {
      return await this.rmqService.send<
        ReviewCommentCreate.Request,
        ReviewCommentCreate.Response
      >(
        ReviewCommentCreate.topic,
        { userId, ...reviewDto },
        {
          headers: { requestId: 'adad' },
        }
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
  @UseGuards(JWTAuthGuard)
  @Post('rating')
  async createRating(
    @UserId() userId: number,
    @Body() reviewDto: RatingCreateDto
  ) {
    try {
      return await this.rmqService.send<
        ReviewRatingCreate.Request,
        ReviewRatingCreate.Response
      >(
        ReviewRatingCreate.topic,
        { userId, ...reviewDto },
        {
          headers: { requestId: 'adad' },
        }
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
}
