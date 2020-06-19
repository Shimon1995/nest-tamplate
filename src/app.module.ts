import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    MailModule,
    TokenModule,
    MongooseModule.forRoot(process.env.mongodb),
  ],
})
export class AppModule {}
