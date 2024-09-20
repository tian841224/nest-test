import { ApiProperty } from '@nestjs/swagger';

export class CatUpdateDto {
  @ApiProperty({ example: 'Jennie' })
  name: string;

  @ApiProperty({ example: 20 })
  age: number;

  @ApiProperty({ example: 'None' })
  breed: string;
}
