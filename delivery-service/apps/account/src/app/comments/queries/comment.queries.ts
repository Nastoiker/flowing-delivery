import { Controller } from '@nestjs/common';
import { CommentRepository } from '../repositories/comment.repositories';

@Controller()
export class CommentQueries {
  constructor(private readonly commentRepository: CommentRepository) {}
}
