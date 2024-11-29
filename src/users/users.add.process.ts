import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { RedisService } from 'src/redis/redis.service';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
@Processor('users')
export class AddUser {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly redisService: RedisService,
  ) {}

  @Process('addUser')
  async addUser(job: Job) {
    const users = job.data;
    for (const user of users) {
      let data = await this.userRepository.create(user);
      data = await this.userRepository.save(data);
      const dataRedis = JSON.parse(JSON.stringify(data));
      await this.redisService.set(
        'usersList',
        dataRedis.id,
        JSON.stringify(data),
        3600,
      );
    }
  }

  //   @OnQueueCompleted()
  //   handleCompleted(job: Job) {
  //     console.log(
  //       `Job ${job.id} has completed successfully with result:`,
  //       job.returnvalue,
  //     );
  // }

  // @OnQueueFailed()
  // handleFailed(job: Job) {
  //   console.log(`Job ${job.id} failed with error:`, job.failedReason);
  // }
}
