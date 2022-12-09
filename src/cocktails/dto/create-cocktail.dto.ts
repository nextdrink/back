import { ApiProperty } from '@nestjs/swagger';

interface IngredientCocktail {
  id: number;
  amount: number;
}

export class CreateCocktailDto {
  @ApiProperty({ example: { en: 'Screw', ru: 'Отвертка' } })
  readonly name: string;

  @ApiProperty({ example: { en: 'Famous cocktail', ru: 'Известный коктейль' } })
  readonly description: string;

  @ApiProperty({
    example: {
      en: { 1: 'Fill collins with ice cubes to the top', 2: 'Pour 50 ml of vodka' },
      ru: { 1: 'Наполни коллинз кубиками льда доверху', 2: 'Налей водку 50 мл' },
    },
  })
  readonly recipe: string;

  @ApiProperty({ example: 'https://iasd3efk.images.com' })
  readonly img: string;

  @ApiProperty({ example: 'Alcohol' })
  readonly strength: string;

  @ApiProperty({ example: 'Bitter' })
  readonly taste: string;

  @ApiProperty({ example: 'Gin' })
  readonly base: string;

  @ApiProperty({ example: 'Classic' })
  readonly group: string;

  @ApiProperty({ example: 'Negroni' })
  readonly series: string;

  @ApiProperty({ example: 'Red' })
  readonly color: string;

  @ApiProperty({ example: 'Mix build' })
  readonly method: string;

  @ApiProperty({ type: [{}] })
  ingredients: IngredientCocktail[];
}
