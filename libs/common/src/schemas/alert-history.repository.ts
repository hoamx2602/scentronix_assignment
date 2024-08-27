import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '../database/abstract.repository';
import { AlertHistory } from './alert-history.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class AlertHistoryRepository extends AbstractRepository<AlertHistory> {
  protected readonly logger = new Logger(AlertHistoryRepository.name);

  constructor(
    @InjectModel(AlertHistory.name) alertHistoryModel: Model<AlertHistory>,
    @InjectConnection() connection: Connection,
  ) {
    super(alertHistoryModel, connection);
  }
}
