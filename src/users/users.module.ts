import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddUser } from './users.add.process';
import { BullModule } from '@nestjs/bull';
import { UserUpdate } from './users.update.process';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    BullModule.registerQueue({
      name: 'users',
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, AddUser, UserUpdate, RedisService],
})
export class UsersModule {}
