import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  private resend = new Resend(process.env.RESEND_API_KEY!);

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    try {
      await this.resend.emails.send({
        from: 'onboarding@resend.dev',
        to,
        subject,
        html: `<strong>${text}</strong>`,
      });
    } catch (error) {
      this.logger.error('sendEmailError', error);
    }
  }
}
