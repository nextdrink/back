import { ApiProperty } from '@nestjs/swagger';

export class DeleteCocktailDto {
  @ApiProperty({ example: 'Cocktail with id 1 deleted' })
  readonly status: string;
}

export class UpdateCocktailDto {
  @ApiProperty({ example: 'Cocktail with id 1 updated' })
  readonly status: string;
}

export class DeleteCocktailImgDto {
  @ApiProperty({ example: 'mops-pes.png' })
  readonly fileName: string;
}
