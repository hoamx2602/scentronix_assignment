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
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Url.name, schema: UrlSchema },
    ]),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
        },
        defaultJobOptions: {
          attempts: 1,
          timeout: 5 * 60 * 1000,
          removeOnComplete: true,
          removeOnFail: true,
          backoff: {
            type: 'fixed',
            delay: 10000,
          },
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: URL_CHECK_QUEUE,
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
