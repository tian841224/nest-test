import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CatCreateDto } from './dtos/cat.create.dto';
import { CatUpdateDto } from './dtos/cat.update.dto';
import { Cat } from './entities/cat.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
// import { REDIS_CLIENT } from 'src/redis/redis.module';
// import Redis from 'ioredis';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class CatService {
  private readonly logger = new Logger(CatService.name);

  constructor(
    @InjectRepository(Cat)
    private catRepository: Repository<Cat>,
    // @Inject(REDIS_CLIENT) 
    // private readonly redis: Redis  
    private readonly redis: RedisService  
  ) {}

  async findAll(): Promise<Cat[]> {
    return await this.catRepository.find();
  }

  async findOne(id: number): Promise<Cat> {
    let cat = await this.catRepository.findOne({ where: { id } });
    this.logger.log(`Searching for cat with ID: ${id}`);
    this.logger.log(`Current cats: ${JSON.stringify(cat)}`);
    if (!cat) {
      throw new NotFoundException('Cat not found');
    }
    return cat;
  }

  async create(dto: CatCreateDto): Promise<Cat> {
    let cat = this.catRepository.create(dto);
    await this.catRepository.save(cat); 
    await this.redis.set(`cat:${cat.id}`, JSON.stringify(cat));
    return cat;
  }

  async update(id: number, dto: CatUpdateDto): Promise<Cat> {
    const cat = await this.findOne(id);
    if (!cat) {
      throw new NotFoundException('Cat not found');
    }
    await this.catRepository.update(id, dto);
    return await this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    const cat = await this.findOne(id);
    if (!cat) {
      throw new NotFoundException('Cat not found');
    }
    await this.catRepository.delete(id);
  }
}
