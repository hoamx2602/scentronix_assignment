import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  ValidateNested,
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

export class GetReachableUrlsDto {
  @IsNumber()
  @IsInt()
  @IsOptional()
  @ApiProperty({
    example: 3,
  })
  filterPriority?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @ApiProperty({
    example: [
      {
        url: 'https://does-not-work.perfume.new',
        priority: 1,
      },
      {
        url: 'https://gitlab.com',
        priority: 4,
      },
    ],
  })
  @Type(() => UrlDto)
  urls: UrlDto[];
}
