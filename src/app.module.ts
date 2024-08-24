import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from '@app/common';

@Module({
  imports: [DatabaseModule, AuthModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
