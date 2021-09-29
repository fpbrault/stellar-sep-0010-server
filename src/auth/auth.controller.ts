import { Body, Controller, Get, Query, Post } from '@nestjs/common';
import * as StellarSdk from 'stellar-sdk';
import { ChallengeService } from '../challenge/challenge.service';
import { TokenService } from '../token/token.service';
import * as dotenv from 'dotenv';
import { Challenge } from '../challenge';
import { Token } from '../token';
StellarSdk.Networks.TESTNET;

dotenv.config();

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

  /**
   * Generates a SEP-0010 challenge
   *
   * @param {Challenge} challenge
   * @return {Promise<ChallengeResponse>}
   * @memberof AuthController
   */
  @Get()
  async generateChallenge(
    @Query() challenge: Challenge,
  ): Promise<ChallengeResponse> {
    return this.challengeService.generateChallenge(challenge);
  }

  /**
   *  generateToken takes a challenge XDR and returns a JTW token.
   *
   * @param {Token} token
   * @return {Promise<TokenResponse>}
   * @memberof AuthController
   */
  @Post()
  async generateToken(@Body() token: Token): Promise<TokenResponse> {
    return this.tokenService.generateToken(token);
  }
}
