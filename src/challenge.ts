import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsByteLength,
  IsFQDN,
  IsIn,
  IsOptional,
  Validate,
} from 'class-validator';
import { isEd25519 } from './CustomValidators';
import * as dotenv from 'dotenv';

dotenv.config();
const HOME_DOMAIN = new URL(process.env.HOME_DOMAIN);

export class Challenge {
  @ApiProperty({
    description:
      'The Client Account, which can be a stellar account (G...) or muxed account (M...) that the Client wishes to authenticate with the Server.',
  })
  @Validate(isEd25519, {
    message: '($value) is not a valid Ed25519 Public Key!',
  })
  readonly account: string;

  @ApiPropertyOptional({
    description:
      'The memo to attach to the challenge transaction. Only permitted if a Stellar account (G...) is used. The memo must be of type id. Other memo types are not supported. See the Memo section for details.',
  })
  @IsOptional()
  @IsByteLength(0, 32)
  readonly memo?: string;

  @ApiPropertyOptional({
    description:
      'A Home Domain. Servers that generate tokens for multiple Home Domains can use this parameter to identify which home domain the Client hopes to authenticate with. If not provided by the Client, the Server should assume a default for backwards compatibility with older Clients',
  })
  @IsIn([HOME_DOMAIN.hostname])
  @IsFQDN()
  @IsOptional()
  readonly home_domain?: string;

  @ApiPropertyOptional({
    description:
      'A Client Domain. Supplied by Clients that intend to verify their domain in addition to the Client Account. See Verifying the Client Domain. Servers should ignore this parameter if the Server does not support Client Domain verification, or the Server does not support verification for the specific Client Domain included in the request.',
  })
  @IsFQDN()
  @IsOptional()
  readonly client_domain?: string;
}
