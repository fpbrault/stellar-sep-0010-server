import { Controller, Get, UseGuards, Request, Header } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TokenService, DecodedTokenResponse } from './token/token.service';
import {
  ApiBearerAuth,
  ApiDefaultResponse,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiSecurity,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import {
  DecodedTokenResponseModel,
  DefaultResponseModel,
  UnauthorizedResponseModel,
} from './responseModels';

@Controller()
export class AppController {
  constructor(
    private readonly tokenService: TokenService,
    private configService: ConfigService,
  ) {}

  /**
   * Decodes and returns the JWT token
   *
   * @param {*} req
   * @return {DecodedTokenResponse}
   * @memberof AppController
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiSecurity('bearer')
  @ApiResponse({ type: DecodedTokenResponseModel, status: 200 })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponseModel, status: 401 })
  @ApiDefaultResponse({ type: DefaultResponseModel })
  @ApiOperation({
    summary: 'Example endpoint to test that the JWT is valid.',
  })
  decodeToken(@Request() req: any): Promise<DecodedTokenResponse> {
    return this.tokenService.decodeToken(req.headers.authorization.slice(7));
  }

  @Get('.well-known/stellar.toml')
  @ApiProduces('text/plain')
  @ApiOperation({
    summary: 'This endpoint generates the stellar.toml file dynamically.',
  })
  @Header('content-type', 'text/plain')
  createToml(): string {
    return (
      `ACCOUNTS = [ "` +
      this.configService.get('source.publicKey') +
      `" ]
VERSION = "0.1.0"
SIGNING_KEY = "` +
      this.configService.get('source.publicKey') +
      `"
NETWORK_PASSPHRASE = "` +
      this.configService.get('networkPassphrase') +
      `"
WEB_AUTH_ENDPOINT = "https://` +
      this.configService.get('homeDomain') +
      `/auth"
` +
      this.configService.get('tomlExtras') +
      `
`
    );
  }
}
