import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from '../comment.model';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment) private readonly commentModel: typeof Comment
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

  async findCommentByFoodId(foodId: number) {
    return this.commentModel.findAll({ where: { foodId } });
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
