import { ApiProperty } from '@nestjs/swagger';

export class AddIngredientDto {
  @ApiProperty({ example: 1 })
  readonly userId: number;

  @ApiProperty({ example: 1 })
  readonly ingredientId: number;
}
