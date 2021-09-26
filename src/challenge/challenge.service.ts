import { Injectable } from '@nestjs/common';
import { Challenge } from '../challenge';
import * as StellarSdk from 'stellar-sdk';
import { randomBytes } from 'crypto';
import * as dotenv from 'dotenv';
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

dotenv.config();

const sourceSecretKey = process.env.SERVER_PRIVATE_KEY;
const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);
const sourcePublicKey = sourceKeypair.publicKey();

type ChallengeResponse =
  | {
      transaction: string;
      network_passphrase: string;
    }
  | string;

@Injectable()
export class ChallengeService {
  async generateChallenge(challenge: Challenge): Promise<ChallengeResponse> {
    const transaction = StellarSdk.Utils.buildChallengeTx(
      sourceKeypair,
      challenge.account,
      challenge.home_domain || 'http://localhost:3000',
      300,
      'Test SDF Network ; September 2015',
      'http://localhost:3000/auth',
    );

    return {
      transaction: transaction,
      network_passphrase: 'Test SDF Network ; September 2015',
    };
  }
}
