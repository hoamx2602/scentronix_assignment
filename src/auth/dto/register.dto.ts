import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Max,
  Min,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Min(5)
  @Max(20)
  @ApiProperty({
    example: 'your_username',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  @Min(8)
  @Max(20)
  @ApiProperty({
    example: 'your_password',
  })
  password: string;
}
