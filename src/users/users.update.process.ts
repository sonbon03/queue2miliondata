import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { Repository } from 'typeorm';
import { RedisService } from '../redis/redis.service';
import { UserEntity } from './entities/user.entity';

@Injectable()
@Processor('users')
export class UserUpdate {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly redisService: RedisService,
  ) {}

  @Process('userUpdate')
  async updateUser(job: Job) {
    const { user, fields } = job.data;
    const data = JSON.parse(user);
    Object.assign(data, fields);

    await this.userRepository.save(data);
    await this.redisService.set('usersList', data.id, fields, 3600);
  }

  // @OnQueueCompleted()
  // handleCompleted(job: Job) {
  //   console.log(
  //     `Job ${job.id} has completed successfully with result:`,
  //     job.returnvalue,
  //   );
  // }

  // @OnQueueFailed()
  // handleFailed(job: Job) {
  //   console.log(`Job ${job.id} failed with error:`, job.failedReason);
  // }
}
