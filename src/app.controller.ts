import { Controller, Get, UseGuards, Request, Header } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TokenService, DecodedTokenResponse } from './token/token.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

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
  decodeToken(@Request() req: any): Promise<DecodedTokenResponse> {
    return this.tokenService.decodeToken(req.headers.authorization.slice(7));
  }

  @Get('.well-known/stellar.toml')
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
