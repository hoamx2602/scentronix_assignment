import { User } from '@app/common';
import { PickType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Max,
  Min,
} from 'class-validator';

export class RegisterDto extends PickType(User, ['username', 'password']) {
  @IsString()
  @IsNotEmpty()
  @Min(5)
  @Max(20)
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  @Min(8)
  @Max(20)
  password: string;
}
