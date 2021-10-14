import { Module } from '@nestjs/common';
import {
  isEd25519,
  isNotMuxedAccount,
  isValidChallenge,
  isXDR,
  hasValidSignatures,
} from './CustomValidators';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    isEd25519,
    isNotMuxedAccount,
    isValidChallenge,
    isXDR,
    hasValidSignatures,
  ],
})
export class CustomValidatorsModule {}
