import { ApiProperty } from '@nestjs/swagger';

export class DeleteCocktailDto {
  @ApiProperty({ example: 'Cocktail with id 1 deleted' })
  readonly status: string;
}

export class UpdateCocktailDto {
  @ApiProperty({ example: 'Cocktail with id 1 updated' })
  readonly status: string;
}
