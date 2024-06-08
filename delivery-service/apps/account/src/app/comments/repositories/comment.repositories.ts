import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Food } from '../../food/models/food.model';
import { User } from '../../user/models/user.model';
import { Comment } from '../comment.model';
import { LikeComment } from '../likeComment.model';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment) private readonly commentModel: typeof Comment,
    @InjectModel(LikeComment)
    private readonly likeCommentModel: typeof LikeComment
  ) {}
  async createComment(comment: any) {
    const commentCreated = await this.commentModel.create({
      status: 0,
      ...comment,
    });
    if (!commentCreated) {
      throw new Error('Ошибка создания комментария');
    }
    return commentCreated;
  }
  async findCommentsUser(userId: number) {
    return this.commentModel.findAll({
      where: { userId },
      include: [{ model: Food }],
    });
  }

  async findCommentByFoodId(productId: number, sort) {
    const { field = 'createdAt', direction = 'desc' } = sort || {};

    return this.commentModel.findAll({
      order: [[field, direction]],
      where: { productId },

      include: [{ model: User }],
    });
  }
  async getAllComments({ sort, filter, page, pageSize }) {
    const { field = 'createdAt', direction = 'desc' } = sort || {};
    const { search } = filter;
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
    return this.commentModel.findAndCountAll({
      order: [[field, direction]],
      where,
      include: [{ model: User }, { model: Food }],
    });
  }
  async update(commentId: number, commentDto) {
    const comment = this.commentModel.findByPk(commentId);
    if (!comment) {
      throw new Error('Ошибка, коммент не найден');
    }
    return (await comment).update(commentDto);
  }
  async remove(commentId: number) {
    const comment = this.commentModel.findByPk(commentId);
    if (!comment) {
      throw new Error('Ошибка, коммент не найден');
    }
    return (await comment).destroy();
  }
}
