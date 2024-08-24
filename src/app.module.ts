import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from '@app/common';
import { UrlsModule } from './urls/urls.module';

@Module({
  imports: [DatabaseModule, AuthModule, UsersModule, UrlsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
