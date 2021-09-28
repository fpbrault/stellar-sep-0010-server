import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ChallengeService } from './challenge/challenge.service';
import { TokenService } from './token/token.service';

@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [ChallengeService, TokenService],
})
export class AppModule {}
