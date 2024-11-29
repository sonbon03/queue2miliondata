import Redis from 'ioredis';
import { Injectable, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: 'localhost',
      port: 6379,
    });

    this.redisClient.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
  }

  async set(
    key: string,
    field: string,
    value: string,
    expireSeconds?: number,
  ): Promise<void> {
    try {
      await this.redisClient.hset(key, field, value);
      if (expireSeconds) {
        await this.redisClient.expire(key, expireSeconds);
      }
    } catch (error) {
      console.error('Redis set error:', error);
      throw error;
    }
  }

  async getAllField(key: string) {
    try {
      return await this.redisClient.hgetall(key);
    } catch (error) {
      console.error('Redis getAllField error:', error);
      throw error;
    }
  }

  async get(key: string, field: string): Promise<string | null> {
    try {
      return await this.redisClient.hget(key, field);
    } catch (error) {
      console.error('Redis get error:', error);
      throw error;
    }
  }

  async check(key: string): Promise<boolean> {
    const exists = await this.redisClient.exists(key);
    return exists === 1;
  }

  async deleteKey(key: string, field?: string): Promise<void> {
    try {
      if (field) {
        const keys = await this.redisClient.keys(`${key}:${field}:*`);
        if (keys.length > 0) {
          await this.redisClient.del(...keys);
        }
      } else {
        await this.redisClient.del(key);
      }
    } catch (error) {
      console.error('Redis deleteKey error:', error);
      throw error;
    }
  }

  async delete(key: string, field: string): Promise<void> {
    try {
      await this.redisClient.hdel(key, field);
    } catch (error) {
      console.error('Redis delete error:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await this.redisClient.flushall();
    } catch (error) {
      console.error('Redis flushall error:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }
}
