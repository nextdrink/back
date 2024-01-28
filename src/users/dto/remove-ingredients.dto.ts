import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveIngredientsDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  @ApiProperty({ example: [1, 2] })
  ingredientsId: number[];
}
