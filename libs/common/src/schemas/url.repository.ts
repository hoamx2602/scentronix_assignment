import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '../database/abstract.repository';
import { Url } from './url.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class UrlRepository extends AbstractRepository<Url> {
  protected readonly logger = new Logger(UrlRepository.name);

  constructor(
    @InjectModel(Url.name) UrlModel: Model<Url>,
    @InjectConnection() connection: Connection,
  ) {
    super(UrlModel, connection);
  }

  async insertMany(urls: Partial<Url>[]): Promise<Url[]> {
    try {
      const result = await this.model.insertMany(urls, { ordered: false });
      this.logger.log(`Inserted ${result.length} URLs`);
      return result;
    } catch (error) {
      this.logger.error('Failed to insert URLs', error.stack);
      throw error;
    }
  }
}
