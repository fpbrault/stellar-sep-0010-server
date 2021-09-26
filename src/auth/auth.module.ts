import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ChallengeService } from '../challenge/challenge.service';
import { TokenService } from '../token/token.service';

@Module({
  controllers: [AuthController],
  providers: [ChallengeService, TokenService],
})
export class AuthModule {}
