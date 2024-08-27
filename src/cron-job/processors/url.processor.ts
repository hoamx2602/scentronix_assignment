import { UrlRepository, UserRepository } from '@app/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { UrlDto } from '../../urls/dto';
import { UrlsService } from '../../urls/urls.service';
import { URL_CHECK_QUEUE } from '@app/common/const';
import { Logger } from '@nestjs/common';
import { AlertService } from 'src/alert/alert.service';
import { UserRole } from '@app/common/enums';

@Processor(URL_CHECK_QUEUE)
export class UrlsProcessor {
  private readonly logger = new Logger(UrlsProcessor.name);

  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly userRepository: UserRepository,
    private readonly urlService: UrlsService,
    private readonly alertService: AlertService,
  ) {}

  @Process()
  async handleUrlCheck(job: Job<{ userId: string }>) {
    const { userId } = job.data;

    try {
      const userUrls = await this.findAllUserUrls(userId);

      const onlineUrls = await this.urlService.getOnlineServices(userUrls);
      const offlineUrls = this.getOfflineUrls(userUrls, onlineUrls);

      if (offlineUrls.length) {
        await this.alertService.sendAlert(userId, JSON.stringify(offlineUrls));
      }
    } catch (error) {
      const admins = await this.userRepository.find({
        role: {
          $in: [UserRole.ADMIN, UserRole.MODERATOR],
        },
      });

      const promises = admins.map((admin) =>
        this.alertService.sendAlert(admin._id.toHexString(), 'CANNOT PROCESS'),
      );
      await Promise.all(promises);
    }
  }

  async findAllUserUrls(serviceOwnerId: string) {
    const userUrls = await this.urlRepository.find(
      {
        serviceOwner: serviceOwnerId,
      },
      {
        priority: 1,
        url: 1,
      },
    );

    return userUrls;
  }

  getOfflineUrls(urls: UrlDto[], onlineUrls: UrlDto[]) {
    const onlineUrlsString = new Set(onlineUrls.map((item) => item.url));

    const result = urls.filter((item) => !onlineUrlsString.has(item.url));
    return result;
  }
}
