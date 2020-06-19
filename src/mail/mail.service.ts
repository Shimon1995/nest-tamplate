import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import { IMail } from './interfaces/mail.interface';

@Injectable()
export class MailService {
  async send(list: IMail) {
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail(list);

    console.log(`Message sent: ${info.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  }
}
