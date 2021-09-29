import { Injectable } from '@nestjs/common';
import { Token } from '../token';
import * as StellarSdk from 'stellar-sdk';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

dotenv.config();

/** Default Home Domain
 * @type {string}  */
const HOME_DOMAIN: string = process.env.HOME_DOMAIN;

/** Secret key used for JWT generation
 * @type {string}  */
const JWT_SECRET: string = process.env.JWT_SECRET;

type TokenResponse =
  | {
      token: string;
    }
  | string;

export type DecodedTokenResponse =
  | {
      token: string | jwt.JwtPayload;
    }
  | string;

/**
 * Handles JWT token generation and decoding
 *
 * @export
 * @class TokenService
 */
@Injectable()
export class TokenService {
  /**
   * generateToken takes a (previously validated) challenge XDR and returns a JTW token.
   *
   * @param {Token} token
   * @return {Promise<TokenResponse>}
   * @memberof TokenService
   */
  async generateToken(token: Token): Promise<TokenResponse> {
    const xdr = new StellarSdk.Transaction(
      token.transaction,
      'Test SDF Network ; September 2015',
    );

    const payload = {
      iss: HOME_DOMAIN + '/auth',
      sub: xdr.operations[0].source,
      iat: parseInt(xdr.timeBounds.minTime, 10),
      exp: parseInt(xdr.timeBounds.minTime, 10) + 86400,
    };

    return {
      token: jwt.sign(payload, JWT_SECRET),
    };
  }
  async decodeToken(token: TokenResponse): Promise<DecodedTokenResponse> {
    const decodedToken = jwt.decode(token.toString());
    return {
      token: decodedToken,
    };
  }
}
