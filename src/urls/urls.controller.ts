import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { GetReachableUrlsDto, UrlDto } from './dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Url')
@ApiBearerAuth()
@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('/check-status')
  @ApiOperation({
    description: 'Get reachable urls list and sort',
  })
  @ApiBody({
    type: GetReachableUrlsDto,
  })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  getReachableUrls(
    @Body() reachableUrlsDto: GetReachableUrlsDto,
  ): Promise<UrlDto[]> {
    return this.urlsService.getReachableUrls(reachableUrlsDto);
  }
}
