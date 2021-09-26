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
    const sourceAccount = new StellarSdk.Account(sourcePublicKey, '-1');
    const fee = (await server.fetchBaseFee()).toString();

    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee,
      networkPassphrase: 'Test SDF Network ; September 2015',
    })
      .addOperation(
        StellarSdk.Operation.manageData({
          source: challenge.account,
          name: 'http://localhost:3000/auth',
          value: randomBytes(48).toString('base64'),
        }),
      )
      .addOperation(
        StellarSdk.Operation.manageData({
          source: sourcePublicKey,
          name: 'web_auth_domain',
          value: 'http://localhost:3000/',
        }),
      )
      .addOperation(
        StellarSdk.Operation.manageData({
          source: challenge.account,
          name: 'client_domain',
          value: 'http://client:3000/',
        }),
      )

      .setTimeout(900)
      .build();

    transaction.sign(sourceKeypair);
    const xdrTransaction = transaction.toEnvelope().toXDR('base64');

    return {
      transaction: xdrTransaction,
      network_passphrase: 'Test SDF Network ; September 2015',
    };
  }
}
