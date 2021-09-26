import { Body, Controller, Get, Query, Post } from '@nestjs/common';
import * as StellarSdk from 'stellar-sdk';
import { ChallengeService } from '../challenge/challenge.service';
import { TokenService } from '../token/token.service';
import * as dotenv from 'dotenv';
import { Challenge } from '../challenge';
import { Token } from '../token';
StellarSdk.Networks.TESTNET;

dotenv.config();

const sourceSecretKey = process.env.SERVER_PRIVATE_KEY;

const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);
const sourcePublicKey = sourceKeypair.publicKey();

type ChallengeResponse =
  | {
      transaction: string;
      network_passphrase: string;
    }
  | string;

type TokenResponse =
  | {
      token: string;
    }
  | string;

@Controller('auth')
export class AuthController {
  constructor(
    private readonly challengeService: ChallengeService,
    private readonly tokenService: TokenService,
  ) {}

  @Get()
  async generateChallenge(
    @Query() challenge: Challenge,
  ): Promise<ChallengeResponse> {
    return this.challengeService.generateChallenge(challenge);
  }

  @Post()
  async generateToken(@Body() token: Token): Promise<TokenResponse> {
    return this.tokenService.generateToken(token);
  }
}
