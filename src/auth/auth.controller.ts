import {
  Controller,
  Post,
  Get,
  Body,
  ValidationPipe,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { IUser } from 'src/user/interfaces/user.interface';
import { SignInDTO } from './dto/sign-in.dto';
import { IReadableUser } from 'src/user/interfaces/readable-user.interface';
import { SignOutDTO } from './dto/sign-out.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from 'src/guards/jwt.guard';
// import { User } from 'src/user/decorators/user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  async register(@Body(ValidationPipe) userDto: CreateUserDTO): Promise<IUser> {
    const user = await this.authService.register(userDto);
    this.authService.sendConf(user);
    return user;
  }

  @Post('log-in')
  login(@Body(ValidationPipe) login: SignInDTO): Promise<IReadableUser> {
    return this.authService.logIn(login);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('log-out')
  logout(@Body(ValidationPipe) logout: SignOutDTO /* @User() user: IUser */) {
    return this.authService.logOut(logout);
  }

  @Get('confirm')
  confirm(@Query('token') token: string) {
    return this.authService.confirm(token);
  }
}
