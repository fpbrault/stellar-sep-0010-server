import { Body, Controller, Get, Query, Post } from '@nestjs/common';
import * as StellarSdk from 'stellar-sdk';
import { randomBytes } from 'crypto';
import * as dotenv from 'dotenv';
import { ApiProperty } from '@nestjs/swagger';
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
StellarSdk.Networks.TESTNET;

dotenv.config();

const sourceSecretKey = process.env.SERVER_PRIVATE_KEY;

const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);
const sourcePublicKey = sourceKeypair.publicKey();

type Challenge =
  | {
      transaction: string;
      network_passphrase: string;
    }
  | string;

type Token =
  | {
      token: string;
    }
  | string;

class CreateChallengeDto {
  @ApiProperty({
    description:
      'The Client Account, which can be a stellar account (G...) or muxed account (M...) that the Client wishes to authenticate with the Server.',
  })
  account: string;

  @ApiProperty({
    description:
      'The memo to attach to the challenge transaction. Only permitted if a Stellar account (G...) is used. The memo must be of type id. Other memo types are not supported. See the Memo section for details.',
    required: false,
  })
  memo?: string;

  @ApiProperty({
    description:
      'A Home Domain. Servers that generate tokens for multiple Home Domains can use this parameter to identify which home domain the Client hopes to authenticate with. If not provided by the Client, the Server should assume a default for backwards compatibility with older Clients',
    required: false,
  })
  home_domain?: string;

  @ApiProperty({
    description:
      'A Client Domain. Supplied by Clients that intend to verify their domain in addition to the Client Account. See Verifying the Client Domain. Servers should ignore this parameter if the Server does not support Client Domain verification, or the Server does not support verification for the specific Client Domain included in the request.',
    required: false,
  })
  client_domain?: string;
}

class CreateTokenDto {
  @ApiProperty({
    description: 'The base64 encoded signed challenge transaction XDR',
  })
  transaction: string;
}

@Controller('auth')
export class AuthController {
  @Get()
  async generateChallenge(
    @Query() createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    if (StellarSdk.StrKey.isValidEd25519PublicKey(createChallengeDto.account)) {
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
            source: createChallengeDto.account,
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
            source: createChallengeDto.account,
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

  @Post()
  async generateToken(@Body() createTokenDto: CreateTokenDto): Promise<Token> {
    const xdr = new StellarSdk.Transaction(
      createTokenDto.transaction,
      'Test SDF Network ; September 2015',
    );
    console.log(
      'source is same as server' + xdr.source.toString() === sourcePublicKey,
    );
    console.log('timebounds:' + JSON.stringify(xdr.timeBounds, null, 2));
    console.log('current time:' + new Date().valueOf().toString().slice(0, -3));
    console.log(
      'maxTime bigger than current time:' +
        (parseInt(new Date().valueOf().toString().slice(0, -3), 10) -
          parseInt(xdr.timeBounds.maxTime, 10) >
          0),
    );
    console.log('numberOfOperations:' + xdr.operations.length);
    console.log('operations: ' + JSON.stringify(xdr.operations, null, 2));
    console.log(
      'Transaction enveloppe has correct signature:' +
        JSON.stringify(xdr.signatures, null, 2),
    );
    console.log('sequenceNumber:' + xdr.sequence);

    return {
      token: xdr.toXDR(),
    };
  }
}
