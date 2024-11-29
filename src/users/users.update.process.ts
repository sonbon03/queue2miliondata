import { Process, Processor } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';

@Injectable()
@Processor('users')
export class UserUpdate {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  @Process('userUpdate')
  async updateUser(job: Job) {
    const { user, fields } = job.data;
    Object.assign(user, fields);
    await this.userRepository.save(user);
  }
}
