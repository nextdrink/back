import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Negroni' })
  readonly email: string;

  @ApiProperty({ example: 'Alcohol' })
  readonly password: string;

  readonly status: string;
}
