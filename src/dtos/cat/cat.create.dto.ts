import { ApiProperty } from '@nestjs/swagger';

export class CatCreateDto {
    @ApiProperty({ example: 'Tommy' })
    name: string;

    @ApiProperty({ example: 2 })
    age: number;

    @ApiProperty({ example: 'Siamese' })
    breed: string;
}