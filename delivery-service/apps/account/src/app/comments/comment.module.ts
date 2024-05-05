import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Comment } from './comment.model';
import { LikeComment } from './likeComment.model';
import { CommentQueries } from './queries/comment.queries';
import { CommentRepository } from './repositories/comment.repositories';

@Module({
  imports: [SequelizeModule.forFeature([Comment, LikeComment])],
  providers: [CommentRepository],
  exports: [CommentRepository],
  controllers: [CommentQueries],
})
export class CommentModule {}
