import { AlertMethod, AlertMethodRepository, User } from '@app/common';
import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateAlertMethodDto, UpdateAlertMethodDto } from './dto';
import { ALERT_METHOD_ALREADY_EXIST_FOR_USER } from '@app/common/error-messages';

@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);
  constructor(private readonly alertMethodRepository: AlertMethodRepository) {}
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
}
