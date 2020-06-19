import {
  Controller,
  Post,
  Get,
  Body,
  ValidationPipe,
  Query,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { SignInDTO } from './dto/sign-in.dto';

import { IReadableUser } from 'src/user/interfaces/readable-user.interface';
import { Result } from 'src/shared/interfaces/result.interface';
import { IUser } from 'src/user/interfaces/user.interface';

import { User } from 'src/user/decorators/user.decorator';

import { JwtGuard } from 'src/guards/jwt.guard';

import { AuthService } from './auth.service';

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
  @Delete('log-out')
  logout(@User() user: IUser): Promise<Result> {
    return this.authService.logOut(user._id);
  }

  @Get('confirm')
  confirm(@Query('token') token: string) {
    return this.authService.confirm(token);
  }
}
