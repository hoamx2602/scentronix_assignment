import { UserRepository } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UrlsService } from 'src/urls/urls.service';

@Injectable()
export class CronJobService {
  constructor(
    private readonly urlsService: UrlsService,
    private readonly userRepository: UserRepository,
  ) {}

  @Cron(CronExpression.EVERY_SECOND)
  async handleCron() {
    const users = await this.userRepository.find({});

    for (const user of users) {
      await this.urlsService.scheduleUrlCheck(user._id.toHexString());
    }
  }
}
