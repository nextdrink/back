import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddIngredientDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  readonly ingredientId: number;
}
