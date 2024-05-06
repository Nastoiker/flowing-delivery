import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
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
      ...comment,
    });
    if (!commentCreated) {
      throw new Error('Ошибка создания комментария');
    }
    return commentCreated;
  }
  async findCommentsUser(userId: number) {
    return this.commentModel.findAll({ where: { userId } });
  }

  async findCommentByFoodId(productId: number) {
    return this.commentModel.findAll({
      where: { productId },
      include: [{ model: User }],
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
