import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class QueryDto {
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Priority number using for filter',
    example: 3,
  })
  @Type(() => Number)
  filterPriority?: number;
}
