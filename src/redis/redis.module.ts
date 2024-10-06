import {  Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisConfigModule } from './redis.confing.module';


@Module({
  imports: [RedisConfigModule],
  exports: [RedisService],
  providers: [ RedisService],
})
export class RedisModule {}