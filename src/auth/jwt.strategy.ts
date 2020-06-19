import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenService } from 'src/token/token.service';
import { IUser } from 'src/user/interfaces/user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private tokenService: TokenService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('secret'),
      passReqToCallback: true,
    });
  }

  async validate(req: any, user: Partial<IUser>) {
    const token = req.headers.authorization.slice(7);
    const tokenExists = this.tokenService.exists(user._id, token);
    if (tokenExists) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }
}
