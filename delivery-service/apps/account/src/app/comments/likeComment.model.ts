import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Comment } from '../comments/comment.model';
import { User } from '../user/models/user.model';

@Table({ timestamps: true })
export class LikeComment extends Model {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;
  @ForeignKey(() => Comment)
  commentId: number;

  @ForeignKey(() => User)
  userId: number;
  @BelongsTo(() => Comment)
  comment: Comment;
  @BelongsTo(() => User)
  user: User;
}
