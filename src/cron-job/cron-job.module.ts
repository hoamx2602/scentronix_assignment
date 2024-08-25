import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronJobService } from './cron-job.service';
import { UrlRepository, User, UserRepository, UserSchema } from '@app/common';
import { UrlsService } from 'src/urls/urls.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [CronJobService, UserRepository, UrlsService, UrlRepository],
  exports: [CronJobService],
})
export class CronJobModule {}
