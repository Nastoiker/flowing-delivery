import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { UserQueries } from './queries/user.queries';
import { UserRepository } from './repositories/user.repositories';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UserRepository],
  controllers: [UserQueries],
  exports: [UserRepository],
})
export class UserModule {}
