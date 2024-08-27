import { Module } from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AlertMethod,
  AlertMethodRepository,
  AlertMethodSchema,
} from '@app/common';
import { EmailService } from './methods/email.service';
import { SlackWebhookService } from './methods/slack.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AlertMethod.name, schema: AlertMethodSchema },
    ]),
  ],
  controllers: [AlertController],
  providers: [
    AlertService,
    AlertMethodRepository,
    EmailService,
    SlackWebhookService,
  ],
})
export class AlertModule {}
