import { IsString, IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly token: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly uId: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  readonly expiresAt: string;
}
