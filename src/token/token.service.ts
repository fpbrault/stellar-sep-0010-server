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
    /* 
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
    console.log('sequenceNumber:' + xdr.sequence); */

    return {
      token: xdr.toXDR(),
    };
  }
}
