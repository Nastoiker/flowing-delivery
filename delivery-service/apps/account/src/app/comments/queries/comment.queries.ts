import {
  ReviewCommentCreate,
  ReviewCommentUpdate,
  ReviewsCommentsFindByFoodId,
  ReviewsCommentsFindByUserId,
} from '@delivery-service/contracts';
import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { CommentRepository } from '../repositories/comment.repositories';

@Controller()
export class CommentQueries {
  constructor(private readonly commentRepository: CommentRepository) {}
  @RMQValidate()
  @RMQRoute(ReviewCommentCreate.topic)
  async createComment(
    @Body() dto: ReviewCommentCreate.Request
  ): Promise<ReviewCommentCreate.Response> {
    await this.commentRepository.createComment(dto);
    return {
      message: 'Создался коммент',
    };
  }
  @RMQValidate()
  @RMQRoute(ReviewCommentUpdate.topic)
  async updateComment(
    @Body() { id, ...dto }: ReviewCommentUpdate.Request
  ): Promise<ReviewCommentUpdate.Response> {
    const comment = await this.commentRepository.update(id, dto);
    return {
      comment,
    };
  }
  @RMQValidate()
  @RMQRoute(ReviewsCommentsFindByFoodId.topic)
  async commentsByFoodId(
    @Body() { productId, sort }: ReviewsCommentsFindByFoodId.Request
  ): Promise<ReviewsCommentsFindByFoodId.Response> {
    const comments = await this.commentRepository.findCommentByFoodId(
      productId,
      sort
    );
    return {
      comments,
    };
  }
  @RMQValidate()
  @RMQRoute(ReviewsCommentsFindByUserId.topic)
  async commentsByUserId(
    @Body() { userId }: ReviewsCommentsFindByUserId.Request
  ): Promise<ReviewsCommentsFindByUserId.Response> {
    const comments = await this.commentRepository.findCommentsUser(userId);
    return {
      comments,
    };
  }
}
