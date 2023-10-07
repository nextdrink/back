import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ConfirmUserDto {
  @ApiProperty({ example: 'ae3sdd3f39sdf023rwe9d' })
  @IsNotEmpty()
  readonly token: string;
}
