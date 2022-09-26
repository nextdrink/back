import { ApiProperty } from '@nestjs/swagger';

export class CreateIngredientDto {
  @ApiProperty({ example: 'Vodka' })
  readonly name: string;

  @ApiProperty({ example: 'History of drink' })
  readonly description: string;

  @ApiProperty({ example: 'https://iasd3efk.images.com' })
  readonly img: string;

  @ApiProperty({ example: 'Alcohol' })
  readonly strength: string;

  @ApiProperty({ example: 'Cherry' })
  readonly base: string;

  @ApiProperty({ example: 'Bitter' })
  readonly taste: string;
}
