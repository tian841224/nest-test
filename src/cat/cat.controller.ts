import {Body, Controller, Delete,Get,Logger,NotFoundException,Param,Post,Put} from '@nestjs/common';
import { CatService } from './cat.service';
import { Cat } from './entities/cat.entity';
import { CatCreateDto } from './dtos/cat.create.dto';
import { CatUpdateDto } from './dtos/cat.update.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('cats')
@Controller('cat')
export class CatController {
  private readonly logger = new Logger(CatController.name);

  constructor(private readonly catService: CatService) {}

  @Get()
  @ApiOperation({ summary: '查找所有貓' })
  async findAll(): Promise<Cat[]> {
    this.logger.log('Finding all cats');
    return await this.catService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '查找單個貓' })
  async findOne(@Param('id') id: number): Promise<Cat> {
    this.logger.log(`Finding cat with id ${id}`);
    const cat = await this.catService.findOne(id);


    if (!cat) {
      throw new NotFoundException('Cat not found');
    }
    return cat;
  }

  @Post()
  @ApiOperation({ summary: '建立貓' })
  async create(@Body() dto: CatCreateDto): Promise<Cat> {
    this.logger.log(`Creating cat with name ${dto.name}`);
    return await this.catService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新貓' })
  async update(@Param('id') id: number, @Body() dto: CatUpdateDto): Promise<Cat> {
    this.logger.log(`Updating cat with id ${id}`);
    return await this.catService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '刪除貓' })
  async delete(@Param('id') id: number): Promise<void> {
    this.logger.log(`Deleting cat with id ${id}`);
    await this.catService.delete(id);
  }
}
