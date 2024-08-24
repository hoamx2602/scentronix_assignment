import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class UrlDto {
  @IsString()
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsNumber()
  @IsInt()
  @Min(1)
  priority: number;
}
