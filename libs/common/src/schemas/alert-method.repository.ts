import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '../database/abstract.repository';
import { AlertMethod } from './alert-method.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class AlertMethodRepository extends AbstractRepository<AlertMethod> {
  protected readonly logger = new Logger(AlertMethodRepository.name);

  constructor(
    @InjectModel(AlertMethod.name) alertMethodModel: Model<AlertMethod>,
    @InjectConnection() connection: Connection,
  ) {
    super(alertMethodModel, connection);
  }
}
