import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { UrlDto } from './url.dto';

export class GetReachableUrlsDto {
  @IsNumber()
  @IsInt()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Priority number using for filter',
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
