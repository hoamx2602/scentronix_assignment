import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronJobService } from './cron-job.service';
import {
  Url,
  UrlRepository,
  UrlSchema,
  User,
  UserRepository,
  UserSchema,
} from '@app/common';
import { UrlsService } from 'src/urls/urls.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { URL_CHECK_QUEUE } from '@app/common/const';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Url.name, schema: UrlSchema },
    ]),
    BullModule.registerQueue({
      name: URL_CHECK_QUEUE,
    }),
    BullBoardModule.forFeature({
      name: URL_CHECK_QUEUE,
      adapter: BullAdapter,
    }),
  ],
  providers: [
    CronJobService,
    UserRepository,
    UrlsService,
    UrlRepository,
    UserRepository,
  ],
  exports: [CronJobService],
})
export class CronJobModule {}
