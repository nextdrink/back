import { ApiProperty } from '@nestjs/swagger';

export class RemoveCocktailsDto {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: [1, 2] })
  cocktailsId: number[];
}
