import { ApiProperty } from '@nestjs/swagger';

export class AddCocktailDto {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 1 })
  readonly cocktailId: number;
}
