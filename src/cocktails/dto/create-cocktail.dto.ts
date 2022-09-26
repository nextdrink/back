import { ApiProperty } from '@nestjs/swagger';

interface IngredientCocktail {
  id: number;
  amount: number;
}

export class CreateCocktailDto {
  @ApiProperty({ example: '{"en":"Screw","ru":"Отвертка"}' })
  readonly name: string;

  @ApiProperty({ example: '{"en":"Famous cocktail","ru":"Известный коктейль"}' })
  readonly description: string;

  @ApiProperty({ example: '{"en":{1:"",2:""},"ru":{1:"",2:""}}' })
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
