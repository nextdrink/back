import { ApiProperty } from '@nestjs/swagger';

export class RemoveIngredientsDto {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: [1, 2] })
  ingredientsId: number[];
}
