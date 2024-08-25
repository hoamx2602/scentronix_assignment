import { Injectable } from '@nestjs/common';
import { GetReachableUrlsDto, UrlDto } from './dto';
import axios from 'axios';
import { UrlStatus } from './interfaces';

@Injectable()
export class UrlsService {
  private readonly timeout = 5000;

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
}
