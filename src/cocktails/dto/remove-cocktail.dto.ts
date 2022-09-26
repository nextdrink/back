import { ApiProperty } from '@nestjs/swagger';

export class RemoveCocktailDto {
  @ApiProperty({ example: 'Cocktail with id 1 removed' })
  readonly status: string;
}
