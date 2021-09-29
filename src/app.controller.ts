import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TokenService, DecodedTokenResponse } from './token/token.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly tokenService: TokenService) {}

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
}
