import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  @ApiProperty({ example: 'your_username' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  @ApiProperty()
  @ApiProperty({ example: 'your_password' })
  password: string;
}
