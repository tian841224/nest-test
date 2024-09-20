import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiProperty } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiProperty({ description: '測試API', example: 'Hello World' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
