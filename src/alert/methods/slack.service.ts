import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SlackWebhookService {
  private readonly logger = new Logger(SlackWebhookService.name);

  async sendNotification(webhookUrl: string, message: string): Promise<void> {
    try {
      await axios.post(webhookUrl, {
        text: message,
      });
    } catch (error) {
      this.logger.error('sendNotificationFailed', error);
    }
  }
}
