import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsUrl } from 'class-validator';

export class CreateIngredientDto {
  @IsObject({ message: 'name field is not correct object' })
  @ApiProperty({
    example: {
      en: 'Vodka',
      ua: 'Горілка',
    },
  })
  readonly name: object;

  @IsObject({ message: 'description field is not correct object' })
  @ApiProperty({
    example: {
      en: 'Classic alko',
      ua: 'Класичний алкоголь',
    },
  })
  readonly description: object;

  @IsUrl()
  @ApiProperty({ example: 'https://iasd3efk.images.com' })
  readonly img: string;

  @IsNotEmpty({ message: 'strength field is empty' })
  @ApiProperty({ example: 'Alcohol' })
  readonly strength: string;

  @IsNotEmpty({ message: 'base field is empty' })
  @ApiProperty({ example: 'Cherry' })
  readonly base: string;

  // @IsNotEmpty({ message: 'taste field is empty' })
  @ApiProperty({ example: 'Bitter' })
  readonly taste: string = null;
}
