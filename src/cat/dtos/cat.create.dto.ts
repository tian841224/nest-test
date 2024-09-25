import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CatCreateDto {
    @ApiProperty({ example: 'Tommy' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 2 })
    @IsNumber()
    @IsNotEmpty()
    age: number;

    @ApiProperty({ example: 'Siamese' })
    @IsString()
    @IsNotEmpty()
    breed: string;
}