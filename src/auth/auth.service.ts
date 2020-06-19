import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { SignOptions } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { omit } from 'lodash';
import * as moment from 'moment';

import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { CreateTokenDTO } from 'src/token/dto/create-token.dto';
import { SignInDTO } from './dto/sign-in.dto';

import { ITokenPayload } from 'src/token/interfaces/token-payload.interface';
import { Result } from 'src/shared/interfaces/result.interface';
import { IUser } from 'src/user/interfaces/user.interface';
import { IMail } from 'src/mail/interfaces/mail.interface';
import { IToken } from 'src/token/interfaces/token.interface';
import { IReadableUser } from 'src/user/interfaces/readable-user.interface';

import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/user/user.service';
import { TokenService } from 'src/token/token.service';

import { EStatus } from 'src/user/enums/status.enum';
import { ERoles } from 'src/user/enums/roles.enum';
import { EUserSensitive } from 'src/user/enums/user-sensitive.enum';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private mailService: MailService,
    private tokenService: TokenService,
    private jwtService: JwtService,
    private cnfigService: ConfigService,
  ) {}

  async register(userDto: CreateUserDTO): Promise<IUser> {
    return this.userService.add(userDto);
  }

  async sendConf(user: IUser) {
    const expiresIn = 60 * 60 * 24;
    const tokenPayload = {
      _id: user._id,
      status: user.status,
      roles: user.roles,
    };

    const expiresAt = moment()
      .add(1, 'day')
      .toISOString();

    const token = this.generateBearerToken(tokenPayload, { expiresIn });

    const link = this.cnfigService.get<string>('client_app');
    const tokenLink = `${link}/auth/confirm/${token}`;

    this.saveToken({ token, uId: user._id, expiresAt });

    const list: IMail = {
      from: 'mail@mail.com',
      to: user.email,
      subject: 'Account Confirmation',
      html: `
                <h1>Hello, ${user.fullName}</h1>
                <p>Follow the <a href="${tokenLink}">link</a> to confirm your account</p>
            `,
    };

    this.mailService.send(list as IMail);
  }

  async confirm(token: string) {
    const data = await this.verifyBearerToken(token);
    const user = await this.userService.find(data._id);

    await this.tokenService.remove(data._id, token);

    if (user && user.status === EStatus.pending) {
      user.status = EStatus.active;
      user.roles = [ERoles.user];
      return user.save();
    }
    throw new BadRequestException('Confirmation Error');
  }

  async logIn({ email, password }: SignInDTO): Promise<IReadableUser> {
    const user = await this.userService.findByEmail(email);
    await this.tokenService.removeAll(user._id);

    if (user && (await compare(password, user.password))) {
      if (user.status !== EStatus.active) {
        throw new UnauthorizedException();
      }

      const tokenPayload = {
        _id: user._id,
        status: user.status,
        roles: user.roles,
      };

      const token = this.generateBearerToken(tokenPayload);
      const expiresAt = moment()
        .add(1, 'day')
        .toISOString();
      await this.saveToken({ token, expiresAt, uId: user._id });

      const readableUser = user.toObject() as IReadableUser;
      readableUser.token = token;

      return omit<IReadableUser>(
        readableUser,
        Object.values(EUserSensitive),
      ) as IReadableUser;
    }
    throw new UnauthorizedException();
  }

  async logOut(_id: string): Promise<Result> {
    return this.tokenService.removeAll(_id);
  }

  private generateBearerToken(
    data: ITokenPayload,
    options?: SignOptions,
  ): string {
    return this.jwtService.sign(data, options);
  }

  private async verifyBearerToken(token: string): Promise<ITokenPayload> {
    try {
      const verificationData = (await this.jwtService.verify(
        token,
      )) as ITokenPayload;
      const tokenExists = await this.tokenService.exists(
        verificationData._id,
        token,
      );
      if (tokenExists) {
        return verificationData;
      }
      throw new UnauthorizedException();
    } catch (_e) {
      throw new UnauthorizedException();
    }
  }

  private saveToken(createTokenDto: CreateTokenDTO): Promise<IToken> {
    return this.tokenService.create(createTokenDto);
  }
}
