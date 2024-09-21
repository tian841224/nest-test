import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CatCreateDto } from './dtos/cat.create.dto';
import { CatUpdateDto } from './dtos/cat.update.dto';
import { Cat } from './entities/cat.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CatService {
  private readonly logger = new Logger(CatService.name);

  constructor(
    @InjectRepository(Cat)
    private catRepository: Repository<Cat>,
  ) {}

  async findAll(): Promise<Cat[]> {
    return await this.catRepository.find();
  }

  async findOne(id: number): Promise<Cat> {
    let cat = await this.catRepository.findOne({ where: { id } });
    this.logger.log(`Searching for cat with ID: ${id}`);
    this.logger.log(`Current cats: ${JSON.stringify(cat)}`);
    return cat;
  }

  async create(dto: CatCreateDto): Promise<Cat> {
    let cat = this.catRepository.create(dto);
    await this.catRepository.save(cat); 
    return cat;
  }

  async update(id: number, dto: CatUpdateDto): Promise<Cat> {
    const cat = await this.findOne(id);
    if (!cat) {
      throw new NotFoundException('Cat not found');
    }
    this.catRepository.update(id, dto);
    return cat;
  }

  async delete(id: number): Promise<void> {
    const cat = await this.findOne(id);
    if (!cat) {
      throw new NotFoundException('Cat not found');
    }
    await this.catRepository.delete(id);
  }
}
