import { User } from '@app/common';
import { PickType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto extends PickType(User, ['username', 'password']) {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}
