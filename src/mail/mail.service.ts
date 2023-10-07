import { Injectable } from '@nestjs/common';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
const mailgun = new Mailgun(formData);
import { ConfigService } from '@nestjs/config';
import { IMailgunClient } from 'mailgun.js/Interfaces';

export interface IMailGunData {
  readonly from: string;
  readonly to: string;
  readonly subject: string;
  readonly text: string;
}

@Injectable()
export class MailService {
  private mg: IMailgunClient;

  constructor(private readonly configService: ConfigService) {
    this.mg = mailgun.client({
      username: 'api',
      key: this.configService.get<string>('MAILGUN_API_KEY'),
    });
  }

  async send(data) {
    return this.mg.messages
      .create(this.configService.get<string>('MAILGUN_API_DOMAIN'), data)
      .then((msg) => console.log(msg))
      .catch((err) => console.log(err));
  }
}
