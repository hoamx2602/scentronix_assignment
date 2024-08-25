import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { AddUrlsDto, GetReachableUrlsDto, UrlDto } from './dto';
import axios from 'axios';
import { UrlStatus } from './interfaces';
import { UrlRepository, User } from '@app/common';
import { LIST_URL_NOT_SATISFY } from '@app/common/error-messages';

@Injectable()
export class UrlsService {
  private readonly logger = new Logger(UrlsService.name);
  private readonly timeout = 5000;

  constructor(private readonly urlRepository: UrlRepository) {}

  async getReachableUrls(reachableUrlsDto: GetReachableUrlsDto) {
    const { urls, filterPriority } = reachableUrlsDto;
    const filteredList = filterPriority
      ? urls.filter((item) => item.priority === filterPriority)
      : urls;

    const checkPromises = filteredList.map((item) => {
      return this.checkUrlStatus(item.url);
    });

    const results = await Promise.all(checkPromises);

    return this.filterAndSortUrls(filteredList, results);
  }

  async checkUrlStatus(
    url: string,
    timeout: number = this.timeout,
  ): Promise<UrlStatus> {
    try {
      const response = await axios.get(url, {
        timeout,
      });
      const isOnline = response.status >= 200 && response.status < 300;
      return { url, online: isOnline };
    } catch (error) {
      return { url, online: false };
    }
  }

  async getUrlStatuses(urlList: string[]): Promise<UrlStatus[]> {
    const checkPromises = urlList.map((url) => this.checkUrlStatus(url));
    const results = await Promise.all(checkPromises);
    return results;
  }

  filterAndSortUrls(urlsDto: UrlDto[], urlsStatus: UrlStatus[]): UrlDto[] {
    const onlineUrls = new Set(
      urlsStatus.filter((item) => item.online).map((item) => item.url),
    );

    const filteredUrl = urlsDto.filter((item) => onlineUrls.has(item.url));

    return filteredUrl.sort((a, b) => a.priority - b.priority);
  }

  async addUserUrls(user: User, addUrlsDto: AddUrlsDto) {
    const { urls } = addUrlsDto;

    const urlStrings = urls.map((urlDto) => urlDto.url);
    const existingUrls = await this.urlRepository.find({
      url: { $in: urlStrings },
      serviceOwner: user._id.toHexString(),
    });

    if (existingUrls.length) {
      this.logger.error('LIST_URL_NOT_SATISFY', JSON.stringify({ urls, user }));
      throw new BadRequestException(LIST_URL_NOT_SATISFY);
    }

    const mappedUrl = urls.map((item: UrlDto) => ({
      ...item,
      serviceOwner: user._id.toHexString(),
    }));
    const newUrlsCreated = await this.urlRepository.insertMany(mappedUrl);
    this.logger.debug('CREATE_URLS', JSON.stringify({ urls, user }));

    return newUrlsCreated;
  }
}
