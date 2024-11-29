import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { dataSourceOptions } from 'database/data';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisService } from './redis/redis.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forRoot(dataSourceOptions)],
  controllers: [AppController],
  providers: [AppService, RedisService],
})
export class AppModule {}
