import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { isValidChallenge, isXDR } from './CustomValidators';

export class Token {
  @ApiProperty({
    description: 'The base64 encoded signed challenge transaction XDR',
  })
  @Validate(isXDR, ['base64'], {
    message:
      'Transaction is not a valid base64-encoded XDR transaction enveloppe!',
  })
  @Validate(isValidChallenge, {
    message: 'Transaction is not a valid challenge!',
  })
  readonly transaction: string;
}