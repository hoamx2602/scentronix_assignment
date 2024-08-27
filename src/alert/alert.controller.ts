import { User } from '@app/common';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards';
import { AlertService } from './alert.service';
import { CreateAlertMethodDto, UpdateAlertMethodDto } from './dto';

@Controller('alert-methods')
@ApiTags('Alert')
@ApiBearerAuth()
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post('/')
  @ApiOperation({
    description: 'Create new alert method for user',
  })
  @ApiBody({
    type: CreateAlertMethodDto,
  })
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async createNewAlertMethodForUser(
    @CurrentUser() user: User,
    @Body() createAlertDto: CreateAlertMethodDto,
  ) {
    await this.alertService.createNewAlertMethodForUser(user, createAlertDto);
  }

  @Put('/')
  @ApiOperation({
    description: 'Update alert method for user',
  })
  @ApiBody({
    type: UpdateAlertMethodDto,
  })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async updateAlertMethodForUser(
    @CurrentUser() user: User,
    @Body() updateAlertDto: UpdateAlertMethodDto,
  ) {
    await this.alertService.updateAlertMethodForUser(user, updateAlertDto);
  }
}
