import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectQueue('users') private readonly userQueue: Queue,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly redisService: RedisService,
  ) {}
  async create() {
    console.time('startCreateUser');
    let users: {
      name: string;
      email: string;
    }[] = [];
    for (let i = 1; i <= 2000000; i++) {
      users.push({
        name: `user${i}`,
        email: `user${i}@example.com`,
      });
      if (users.length === 1000) {
        await this.userQueue.add('addUser', users);
        users = [];
      }
    }
    console.timeEnd('startCreateUser');
    return;
  }

  async update(id: string, fields: Partial<UpdateUserDto>) {
    console.time('startUpdateUser');
    const user = await this.redisService.get('usersList', id);
    if (!user) {
      throw new BadRequestException('User not found or not exists');
    }
    const data = { user, fields };
    await this.userQueue.add('userUpdate', data);
    console.timeEnd('startUpdateUser');
    return;
  }
}
