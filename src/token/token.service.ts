import { Injectable } from '@nestjs/common';
import { Token } from '../token';
import * as StellarSdk from 'stellar-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

const sourceSecretKey = process.env.SERVER_PRIVATE_KEY;
const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);
const sourcePublicKey = sourceKeypair.publicKey();

type TokenResponse =
  | {
      token: string;
    }
  | string;

@Injectable()
export class TokenService {
  async generateToken(token: Token): Promise<TokenResponse> {
    const xdr = new StellarSdk.Transaction(
      token.transaction,
      'Test SDF Network ; September 2015',
    );

    return {
      token: xdr.toXDR(),
    };
  }
}
