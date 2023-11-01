import { ApiProperty } from '@nestjs/swagger';

export class DeleteIngredientImgDto {
  @ApiProperty({ example: 'mops-pes.png' })
  readonly fileName: string;
}
