import { Injectable } from '@nestjs/common';
import { Token } from '../token';
import * as StellarSdk from 'stellar-sdk';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { MemoNone } from 'stellar-sdk';

dotenv.config();

/** Private Key used by the server
 * @type {string}  */
const sourceSecretKey: string = process.env.SERVER_PRIVATE_KEY;
/** Keypair of the Server Account
 * @type {StellarSdk.Keypair}
 * */
const sourceKeypair: StellarSdk.Keypair =
  StellarSdk.Keypair.fromSecret(sourceSecretKey);
/** Default Home Domain
 * @type {string}  */
const HOME_DOMAIN: string = process.env.HOME_DOMAIN;
/** Network Passphrase
 * @type {string}  */
const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015';

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
    let transaction: StellarSdk.Transaction<
      StellarSdk.Memo<StellarSdk.MemoType>,
      StellarSdk.Operation[]
    >;
    try {
      transaction = new StellarSdk.Transaction(
        token.transaction,
        NETWORK_PASSPHRASE,
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
      iss: HOME_DOMAIN + '/auth',
      sub:
        transaction.memo.type !== MemoNone
          ? clientAccountID + ':' + transaction.memo.value
          : clientAccountID,
      iat: parseInt(transaction.timeBounds.minTime, 10),
      exp: parseInt(transaction.timeBounds.minTime, 10) + 86400,
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
