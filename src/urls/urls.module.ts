import { Module } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { Url, UrlRepository, UrlSchema } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }])],
  controllers: [UrlsController],
  providers: [UrlsService, UrlRepository],
})
export class UrlsModule {}
