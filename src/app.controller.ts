import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import * as StellarSdk from 'stellar-sdk';
import { randomBytes } from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config();

type Challenge =
  | {
      transaction: string;
      network_passphrase: string;
    }
  | string;

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async generateChallenge(
    @Query('account') clientPublicKey: string,
  ): Promise<Challenge> {
    const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
    StellarSdk.Networks.TESTNET;

    if (StellarSdk.StrKey.isValidEd25519PublicKey(clientPublicKey)) {
      const sourceSecretKey = process.env.SERVER_PRIVATE_KEY;

      const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);
      const sourcePublicKey = sourceKeypair.publicKey();
      //const sourceAccount = await server.loadAccount(sourcePublicKey);
      const sourceAccount = new StellarSdk.Account(sourcePublicKey, '-1');
      const fee = await (await server.fetchBaseFee()).toString();

      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee,
        networkPassphrase: 'Test SDF Network ; September 2015',
      })
        // Add a payment operation to the transaction
        .addOperation(
          StellarSdk.Operation.manageData({
            source: clientPublicKey,
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
            source: clientPublicKey,
            name: 'client_domain',
            value: 'http://client:3000/',
          }),
        )
        // Uncomment to add a memo (https://www.stellar.org/developers/learn/concepts/transactions.html)
        // .addMemo(StellarSdk.Memo.text('Hello world!'))
        .setTimeout(900)
        .build();

      // Sign this transaction with the secret key
      // NOTE: signing is transaction is network specific. Test network transactions
      // won't work in the public network. To switch networks, use the Network object
      // as explained above (look for StellarSdk.Network).
      transaction.sign(sourceKeypair);
      const xdrTransaction = transaction.toEnvelope().toXDR('base64');
      // Let's see the XDR (encoded in base64) of the transaction we just built
      return {
        transaction: xdrTransaction,
        network_passphrase: 'Test SDF Network ; September 2015',
      };
    } else {
      return 'Invalid Key';
    }
  }
}
