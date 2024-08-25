import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 'https://example.com',
  })
  url: string;

  @IsNumber()
  @IsInt()
  @Min(1)
  @ApiProperty({
    example: 3,
  })
  priority: number;
}
