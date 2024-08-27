import { ALERT_NOTIFICATION_TEMPLATE } from '@app/common/template';
import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  private resend = new Resend(process.env.RESEND_API_KEY!);

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    const message = ALERT_NOTIFICATION_TEMPLATE.replace(
      '{{ALERT_DETAILS_JSON}}',
      text,
    );
    try {
      await this.resend.emails.send({
        from: 'onboarding@resend.dev',
        to,
        subject,
        html: message,
      });
    } catch (error) {
      this.logger.error('sendEmailError', error);
    }
  }
}
