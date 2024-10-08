import { Module } from '@nestjs/common';
import { CatController } from './cat.controller';
import { CatService } from './cat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { RedisCacheModule } from 'src/redis/redis.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Cat]),
    ],
    controllers: [CatController],
    providers: [CatService],
})
export class CatModule {}
