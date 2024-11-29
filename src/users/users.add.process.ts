import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import {
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';

@Injectable()
@Processor('users')
export class AddUser {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  @Process('addUser')
  async addUser(job: Job) {
    const users = job.data;
    for (const user of users) {
      const data = this.userRepository.create(user);
      await this.userRepository.save(data);
    }
  }

  //   @OnQueueCompleted()
  //   handleCompleted(job: Job) {
  //     console.log(
  //       `Job ${job.id} has completed successfully with result:`,
  //       job.returnvalue,
  //     );

  // @OnQueueFailed()
  //   handleFailed(job: Job) {
  //     console.log(`Job ${job.id} failed with error:`, job.failedReason);
  //   }
}
