import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveCocktailsDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  @ApiProperty({ example: [1, 2] })
  cocktailsId: number[];
}
