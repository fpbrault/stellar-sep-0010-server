import { Injectable } from '@nestjs/common';
import { Token } from '../token';
import * as StellarSdk from 'stellar-sdk';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

dotenv.config();

const HOME_DOMAIN = process.env.HOME_DOMAIN;
const JWT_SECRET = process.env.JWT_SECRET;

type TokenResponse =
  | {
      token: string;
    }
  | string;

type DecodedTokenResponse =
  | {
      token: string | jwt.JwtPayload;
    }
  | string;

@Injectable()
export class TokenService {
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
  async decodeToken(token: Token): Promise<DecodedTokenResponse> {
    const decodedToken = jwt.decode(token.toString());
    return {
      token: decodedToken,
    };
  }
}
