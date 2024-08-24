import { Controller, Get, Query } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { QueryDto, UrlDto } from './dto';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Get()
  findAll(@Query() query: QueryDto): Promise<UrlDto[]> {
    const { priority = undefined } = query;
    return this.urlsService.getReachableUrls(priority);
  }
}
