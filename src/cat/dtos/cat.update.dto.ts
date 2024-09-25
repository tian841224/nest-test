import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CatUpdateDto {
  @ApiProperty({ example: 'Jennie' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 20 })
  @IsNumber()
  @IsNotEmpty()
  age: number;

  @ApiProperty({ example: 'None' })
  @IsString()
  @IsNotEmpty()
  breed: string;
}
