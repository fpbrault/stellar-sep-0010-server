import { Injectable } from '@nestjs/common';
import { Token } from '../token';
import * as StellarSdk from 'stellar-sdk';
import * as jwt from 'jsonwebtoken';
import { MemoNone } from 'stellar-sdk';
import { ConfigService } from '@nestjs/config';

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
  constructor(private configService: ConfigService) {}
  /**
   * generateToken takes a (previously validated) challenge XDR and returns a JTW token.
   *
   * @param {Token} token
   * @return {Promise<TokenResponse>}
   * @memberof TokenService
   */
  async generateToken(token: Token): Promise<TokenResponse> {
    let transaction: StellarSdk.Transaction<
      StellarSdk.Memo<StellarSdk.MemoType>,
      StellarSdk.Operation[]
    >;
    try {
      transaction = new StellarSdk.Transaction(
        token.transaction,
        this.configService.get('networkPassphrase'),
        true,
      );
    } catch {
      throw new Error(
        'Invalid challenge: unable to deserialize challengeTx transaction string',
      );
    }

    const [operation] = transaction.operations;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const clientAccountID: string = operation.source!;
    const payload = {
      iss: 'https://' + this.configService.get('homeDomain') + '/auth',
      sub:
        transaction.memo.type !== MemoNone
          ? clientAccountID + ':' + transaction.memo.value
          : clientAccountID,
      iat: parseInt(transaction.timeBounds.minTime, 10),
      exp: parseInt(transaction.timeBounds.minTime, 10) + 86400,
    };

    return {
      token: jwt.sign(payload, this.configService.get('jwtSecret')),
    };
  }
  async decodeToken(token: TokenResponse): Promise<DecodedTokenResponse> {
    const decodedToken = jwt.decode(token.toString());
    return {
      token: decodedToken,
    };
  }
}
