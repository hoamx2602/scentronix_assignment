import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Max,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Min(5)
  @Max(20)
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
