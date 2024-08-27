import {
  AlertHistoryRepository,
  AlertMethod,
  AlertMethodRepository,
  User,
} from '@app/common';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import {
  CreateAlertMethodDto,
  SaveAlertHistoryDto,
  UpdateAlertMethodDto,
} from './dto';
import {
  ALERT_METHOD_ALREADY_EXIST_FOR_USER,
  NOT_FOUND_ALERT_METHOD,
} from '@app/common/error-messages';
import { AlertMethodTypes } from '@app/common/enums';
import { EmailService } from './methods/email.service';
import { SlackWebhookService } from './methods/slack.service';

@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);
  constructor(
    private readonly alertMethodRepository: AlertMethodRepository,
    private readonly alertHistoryRepository: AlertHistoryRepository,
    private readonly emailService: EmailService,
    private readonly slackService: SlackWebhookService,
  ) {}
  async createNewAlertMethodForUser(
    user: User,
    createAlertDto: CreateAlertMethodDto,
  ): Promise<AlertMethod> {
    const userAlert = await this.alertMethodRepository.findOne({
      user_id: user._id,
    });

    if (userAlert) {
      throw new ConflictException(ALERT_METHOD_ALREADY_EXIST_FOR_USER);
    }

    const newAlert = await this.alertMethodRepository.create({
      user_id: user._id.toHexString(),
      method_type: createAlertDto.method_type,
      details: createAlertDto.details,
    });

    return newAlert;
  }

  async updateAlertMethodForUser(
    user: User,
    updateAlertMethodDto: UpdateAlertMethodDto,
  ) {
    const updateAlertMethod = await this.alertMethodRepository.findOneAndUpdate(
      {
        user_id: user._id.toHexString(),
      },
      {
        $set: {
          details: updateAlertMethodDto.details,
          method_type: updateAlertMethodDto.method_type,
        },
      },
    );

    return updateAlertMethod;
  }

  async sendAlert(userId: string, alertMessage: string) {
    const alertMethod = await this.alertMethodRepository.findOne({
      user_id: userId,
    });

    if (!alertMethod) {
      throw new NotFoundException(NOT_FOUND_ALERT_METHOD);
    }

    switch (alertMethod.method_type) {
      case AlertMethodTypes.EMAIL:
        await this.emailService.sendEmail(
          alertMethod.details.email,
          'ALERT',
          alertMessage,
        );
        break;

      case AlertMethodTypes.SLACK:
        await this.slackService.sendNotification(
          alertMethod.details.slack_webhook_url,
          alertMessage,
        );
        break;

      default:
        throw new NotImplementedException('Unsupported alert method type');
    }
  }

  async saveAlertHistory(alertHistoryDto: SaveAlertHistoryDto) {
    await this.alertHistoryRepository.create({
      user_id: alertHistoryDto.user_id,
      alert_method_id: alertHistoryDto.alert_method_id,
      alert_message: alertHistoryDto.alert_message,
      status: alertHistoryDto.status,
    });
  }
}
