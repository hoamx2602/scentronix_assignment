import { UserRepository } from '@app/common';
import { URL_CHECK_QUEUE } from '@app/common/const';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';

@Injectable()
export class CronJobService {
  private readonly logger = new Logger(CronJobService.name);

  constructor(
    private readonly userRepository: UserRepository,
    @InjectQueue(URL_CHECK_QUEUE) private urlCheckQueue: Queue,
  ) {}

  @Cron(CronExpression.EVERY_SECOND)
  async handleCron() {
    const users = await this.userRepository.find({});

    for (const user of users) {
      await this.scheduleUrlCheck(user._id.toHexString());
    }
  }

  async scheduleUrlCheck(userId: string) {
    await this.urlCheckQueue.add({
      userId,
    });
    this.logger.debug('scheduleUrlCheck', { userId, scheduleTime: Date.now() });
  }
}
