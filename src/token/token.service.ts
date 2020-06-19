import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Result } from 'src/shared/interfaces/result.interface';
import { CreateTokenDTO } from './dto/create-token.dto';
import { IToken } from './interfaces/token.interface';

@Injectable()
export class TokenService {
  constructor(@InjectModel('Token') private tokenModel: Model<IToken>) {}

  create(createTokenDto: CreateTokenDTO): Promise<IToken> {
    return new this.tokenModel(createTokenDto).save();
  }

  exists(uId: string, token: string): Promise<boolean> {
    return this.tokenModel.exists({ uId, token });
  }

  remove(uId: string, token: string): Promise<Result> {
    return this.tokenModel.deleteOne({ uId, token }).exec();
  }

  removeAll(uId: string): Promise<Result> {
    return this.tokenModel.deleteMany({ uId }).exec();
  }
}
