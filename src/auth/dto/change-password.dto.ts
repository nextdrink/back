import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  // TODO: add @Matches() method
  @ApiProperty({ example: '1aDz!deded' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'IkpXVCJ9.eyJlbWFpbCI6ImFkbWluM0B1a3IubmV0Iiwic3ViIjo3LCJpYXQ' })
  token: string;
}
