import { Body, Controller, Get, Query, Post, HttpCode } from '@nestjs/common';
import * as StellarSdk from 'stellar-sdk';
import { ChallengeService } from '../challenge/challenge.service';
import { TokenService } from '../token/token.service';
import { Challenge } from '../challenge';
import { TokenDto } from '../token';
import { ApiDefaultResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  ChallengeResponseModel,
  DefaultResponseModel,
  TokenResponseModel,
} from '../responseModels';
StellarSdk.Networks.TESTNET;

export type ChallengeResponse =
  | {
      transaction: string;
      network_passphrase: string;
    }
  | string;

export type TokenResponse =
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
  @ApiResponse({
    status: 200,
    type: ChallengeResponseModel,
    description:
      'A challenge transaction has been generated and is ready to be signed.',
  })
  @ApiOperation({ summary: 'Generates a SEP-0010 challenge.' })
  @ApiDefaultResponse({ type: DefaultResponseModel })
  async generateChallenge(
    @Query() challenge: Challenge,
  ): Promise<ChallengeResponse> {
    return this.challengeService.generateChallenge(challenge);
  }

  /**
   *  generateToken takes a challenge XDR and returns a JTW token.
   *
   * @param {TokenDto} token
   * @return {Promise<TokenResponse>}
   * @memberof AuthController
   */
  @Post()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: TokenResponseModel,
    description:
      'The transaction is valid and contains all required signatures.',
  })
  @ApiOperation({
    summary:
      'Takes a challenge XDR and returns a JTW token if valid and signed.',
  })
  @ApiDefaultResponse({ type: DefaultResponseModel })
  async generateToken(@Body() token: TokenDto): Promise<TokenResponse> {
    return this.tokenService.generateToken(token);
  }
}
