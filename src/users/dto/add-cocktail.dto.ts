import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddCocktailDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  readonly cocktailId: number;
}
