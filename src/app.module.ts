import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatModule } from './cat/cat.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CatModule,
    DatabaseModule,
    RedisModule,
  ],

  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
