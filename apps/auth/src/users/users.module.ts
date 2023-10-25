import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token, User } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Token])],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
