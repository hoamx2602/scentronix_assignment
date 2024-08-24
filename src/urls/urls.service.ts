import { Injectable } from '@nestjs/common';

@Injectable()
export class UrlsService {
  async getReachableUrls(priority: number) {
    return priority;
  }
}
