import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './dto';
import { ApiBody } from '@nestjs/swagger';
import { User } from '@app/common';
import { Response } from 'express';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.usersService.createUser(registerDto);
    return this.authService.register(user);
  }

  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
    response.send(user);
  }
}
