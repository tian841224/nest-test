import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  async set(key: string, value: any, ttl?: number): Promise<'OK'> {
    this.logger.log(`Setting key ${key} with value ${value}`);
    if (ttl) {
      return await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
    }
    return await this.redis.set(key, JSON.stringify(value));
  }

  async get(key: string): Promise<any> {
    this.logger.log(`Getting key ${key}`);
    const value = await this.redis.get(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return null;
  }

  async del(key: string): Promise<number> {
    this.logger.log(`Deleting key ${key}`);
    return await this.redis.del(key);
  }
}