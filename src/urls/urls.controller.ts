import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { GetReachableUrlsDto, UrlDto } from './dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/role.decorator';
import { UserRole } from '@app/common/enums';
import { RolesGuard, JwtAuthGuard } from '../auth/guards';

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
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getReachableUrls(
    @Body() reachableUrlsDto: GetReachableUrlsDto,
  ): Promise<UrlDto[]> {
    return this.urlsService.getReachableUrls(reachableUrlsDto);
  }
}
