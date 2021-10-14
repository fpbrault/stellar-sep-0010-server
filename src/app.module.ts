import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CustomValidatorsModule } from './CustomValidators.module';
import { ChallengeService } from './challenge/challenge.service';
import { TokenService } from './token/token.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    AuthModule,
    CustomValidatorsModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [AppController],
  providers: [ChallengeService, TokenService],
})
export class AppModule {}
