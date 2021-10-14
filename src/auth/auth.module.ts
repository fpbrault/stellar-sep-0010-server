import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ChallengeService } from '../challenge/challenge.service';
import { TokenService } from '../token/token.service';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PassportModule, ConfigModule.forRoot()],
  controllers: [AuthController],
  providers: [ChallengeService, TokenService, JwtStrategy],
})
export class AuthModule {}
