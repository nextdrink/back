import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

interface IngredientCocktail {
  id: number;
  amount: number;
}

export class CreateCocktailDto {
  @IsNotEmpty({ message: 'name field is empty' })
  @ApiProperty({ example: { en: 'Screw', ua: 'Викрутка' } })
  readonly name: string;

  @ApiProperty({ example: { en: 'Famous cocktail', ua: 'Відомий коктейль' } })
  readonly description: string;

  @IsNotEmpty({ message: 'recipe field is empty' })
  @ApiProperty({
    example: {
      en: { 1: 'Fill collins with ice cubes to the top', 2: 'Pour 50 ml of vodka' },
      ua: { 1: 'Наповни колінз кубиками льоду догори', 2: 'Налий горілку 50 мл' },
    },
  })
  readonly recipe: string;

  @IsUrl()
  @ApiProperty({ example: 'https://iasd3efk.images.com' })
  readonly img: string;

  @IsNotEmpty({ message: 'strength field is empty' })
  @ApiProperty({ example: 'Alcohol' })
  readonly strength: string;

  @IsNotEmpty({ message: 'taste field is empty' })
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

  @ApiProperty({
    example: [
      { id: 1, amount: 50 },
      { id: 2, amount: 150 },
    ],
  })
  ingredients: IngredientCocktail[];
}
