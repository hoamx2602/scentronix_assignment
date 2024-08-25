import { UrlRepository } from '@app/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { UrlDto } from '../../urls/dto';
import { UrlsService } from '../../urls/urls.service';

@Processor('url-check')
export class UrlsProcessor {
  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly urlService: UrlsService,
  ) {}

  @Process()
  async handleUrlCheck(job: Job<{ userId: string }>) {
    const { userId } = job.data;

    try {
      const userUrls = await this.findAllUserUrls(userId);

      const onlineUrls = await this.urlService.getOnlineServices(userUrls);
      const offlineUrls = this.getOfflineUrls(userUrls, onlineUrls);

      if (offlineUrls.length) {
        // TODO: Send alert to User
      }
    } catch (error) {
      // TODO: Send alert to Admin
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
