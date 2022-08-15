import { MailerService } from '@nestjs-modules/mailer';
import { Controller, Get, Injectable, Render } from '@nestjs/common';
import { BASE_URL } from 'src/common/constants';
import { User } from 'src/modules/users/user.entity';


@Controller()
export class AppController {
  @Get()
  @Render('index')
  root() {
    return { message: 'Hello world!' };
  }
}
@Injectable()
export class MailService {
  constructor(private mailService: MailerService) {}

  async sendUserConfirmation(user: User, code: string) {
    const activationUrl = `${BASE_URL}/auth/verify-email/${user.id}/${code}`;
    const templatePath = __dirname + '/templates/confirmation';
    await this.mailService.sendMail({
      to: user.email,
      subject: 'Contacty: Confirm your Email!',
      template: templatePath,
      context: {
        name: user.full_name,
        url: activationUrl
      },
    });
  }
}
