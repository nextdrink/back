import { ApiProperty } from '@nestjs/swagger';

export class AddFavoriteCocktailDto {
  @ApiProperty({ example: 1 })
  readonly userId: number;

  @ApiProperty({ example: 1 })
  readonly cocktailId: number;
}
