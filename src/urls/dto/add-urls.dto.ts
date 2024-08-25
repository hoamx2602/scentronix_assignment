import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { UrlDto } from './url.dto';

export class AddUrlsDto {
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
