import { Body, Controller, Delete, Get, Logger, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { CatService } from './cat.service';
import { CatEntity } from '../entities/cat.entity';
import { CatCreateDto } from '../dtos/cat/cat.create.dto';
import { CatUpdateDto } from '../dtos/cat/cat.update.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('cats')
@Controller('cat')
export class CatController {
    private readonly logger = new Logger(CatController.name);

    constructor(private readonly catService: CatService) {}

    @Get()
    @ApiOperation({ summary: '查找所有貓' })
    findAll(): CatEntity[] {
        this.logger.log('Finding all cats');
        return this.catService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: '查找單個貓' })
    findOne(@Param('id') id: number): CatEntity {
        this.logger.log(`Finding cat with id ${id}`);
        const cat = this.catService.findOne(id);
        if (!cat) {
            throw new NotFoundException('Cat not found');
        }
        return cat;
    }

    @Post()
    @ApiOperation({ summary: '建立貓' })
    create(@Body() dto: CatCreateDto): CatEntity {
        this.logger.log(`Creating cat with name ${dto.name}`);
        return this.catService.create(dto);
    }

    @Put(':id')
    @ApiOperation({ summary: '更新貓' })
        update(@Param('id') id: number, @Body() dto: CatUpdateDto): CatEntity {
        this.logger.log(`Updating cat with id ${id}`);
        return this.catService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: '刪除貓' })
    delete(@Param('id') id: number): void {
        this.logger.log(`Deleting cat with id ${id}`);
        this.catService.delete(id);
    }
}