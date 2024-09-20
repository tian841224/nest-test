import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CatCreateDto } from 'src/dtos/cat/cat.create.dto';
import { CatEntity } from '../entities/cat.entity';
import { CatUpdateDto } from 'src/dtos/cat/cat.update.dto';

@Injectable()
export class CatService {
  private readonly logger = new Logger(CatService.name);
  private cats: CatEntity[] = [];

  findAll(): CatEntity[] {
    return this.cats;
  }

  findOne(id: number): CatEntity {
    this.logger.log(`Searching for cat with ID: ${id}`);
    this.logger.log(`Current cats: ${JSON.stringify(this.cats)}`);
    return this.cats.find((cat) => cat.id == id);
  }

  create(dto: CatCreateDto): CatEntity {
    let maxId: number = 0;

    //判斷cat是否有資料
    if (this.cats.length !== 0) {
      //取出最大ID
      maxId = Math.max(...this.cats.map((cat) => cat.id));
    }

    let cat = new CatEntity(maxId + 1, dto.name, dto.age, dto.breed);
    this.cats.push(cat);
    return cat;
  }

    update(id: number, dto: CatUpdateDto): CatEntity {
    const cat = this.findOne(id);
    if (!cat) {
      throw new NotFoundException('Cat not found');
    }
    cat.name = dto.name;
    cat.age = dto.age;
    cat.breed = dto.breed;
    return cat;
  }

  delete(id: number): void {
    const cat = this.findOne(id);
    if (!cat) {
      throw new NotFoundException('Cat not found');
    }
    this.cats = this.cats.filter((cat) => cat.id !== id);
  }
}
