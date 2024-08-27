import { User, UserRepository } from '@app/common';
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

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleCron() {
    (await this.userRepository.filterWithCursor({})).eachAsync(
      async (doc: User) => {
        await this.scheduleUrlCheck(doc._id.toHexString());
      },
      {
        parallel: 5,
      },
    );
  }

  async scheduleUrlCheck(userId: string) {
    await this.urlCheckQueue.add({
      userId,
    });
    this.logger.debug('scheduleUrlCheck', { userId, scheduleTime: Date.now() });
  }
}
