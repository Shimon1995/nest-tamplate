import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TokenService } from './token.service';
import { TokenSchema } from './schemas/token.schema';

@Module({
  providers: [TokenService],
  imports: [
    MongooseModule.forFeature([{ name: 'Token', schema: TokenSchema }]),
  ],
  exports: [TokenService],
})
export class TokenModule {}
