import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChallengeService } from './challenge/challenge.service';
import { TokenService } from './token/token.service';

@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [AppService, ChallengeService, TokenService],
})
export class AppModule {}
