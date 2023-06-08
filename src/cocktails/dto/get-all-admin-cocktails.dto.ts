import { ApiProperty } from '@nestjs/swagger';

export class GetAllAdminCocktailsDto {
  @ApiProperty({ example: 1 })
  readonly id: number;

  @ApiProperty({ example: 'Gin tonic' })
  readonly name: string;

  @ApiProperty({ example: 'https://iasd3efk.images.com' })
  readonly img: string;
}
