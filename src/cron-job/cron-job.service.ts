import { UserRepository } from '@app/common';
import { URL_CHECK_QUEUE } from '@app/common/const';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';
import { UrlsService } from 'src/urls/urls.service';

@Injectable()
export class CronJobService {
  constructor(
    private readonly urlsService: UrlsService,
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
  }
}
