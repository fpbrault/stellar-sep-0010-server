import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import * as StellarSdk from 'stellar-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

const sourceSecretKey = process.env.SERVER_PRIVATE_KEY;
const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);
const sourcePublicKey = sourceKeypair.publicKey();

@ValidatorConstraint({ name: 'ed25519key', async: true })
export class isEd25519 implements ValidatorConstraintInterface {
  validate(value: string) {
    return StellarSdk.StrKey.isValidEd25519PublicKey(value);
  }

  defaultMessage() {
    return 'Key is not a valid Ed25519 Public Key!';
  }
}

@ValidatorConstraint({ name: 'xdrtransaction', async: true })
export class isXDR implements ValidatorConstraintInterface {
  validate(input: Buffer, validationArguments: ValidationArguments) {
    return StellarSdk.xdr.TransactionEnvelope.validateXDR(
      input,
      validationArguments.constraints[0],
    );
  }

  defaultMessage() {
    return 'Transaction is not a valid XDR transaction!';
  }
}

@ValidatorConstraint({ name: 'validatechallenge', async: true })
export class isValidChallenge implements ValidatorConstraintInterface {
  validate(input: string) {
    //decode the received input as a base64-urlencoded XDR representation of Stellar transaction envelope;
    const xdr = new StellarSdk.Transaction(
      input,
      'Test SDF Network ; September 2015',
    );
    // verify that transaction source account is equal to the Server Account
    if (xdr.source.toString() !== sourcePublicKey) {
      return false;
    }
    // verify that transaction has time bounds set;
    if (!xdr.timeBounds) {
      return false;
    }
    // verify that current time is between the minimum and maximum bounds;
    if (
      parseInt(new Date().valueOf().toString().slice(0, -3), 10) -
        parseInt(xdr.timeBounds.maxTime, 10) >
      0
    ) {
      return false;
    }

    // verify that transaction contains at least one operation;
    if (xdr.operations.length === 0) {
      return false;
    }

    /* verify that transaction's first operation:
       is a Manage Data operation
       has a non-null source account */
    if (
      xdr.operations[0].type !== 'manageData' ||
      xdr.operations[0].source === null
    ) {
      return false;
    }

    // TODO: verify that transaction envelope has a correct signature by the Server Account

    // TODO: if the first operation's source account exists:
    // TODO: verify that the remaining signature count is one or more;
    // TODO: verify that remaining signatures on the transaction are signers of the Client Account
    // TODO: verify that remaining signatures are correct;
    // TODO: verify that remaining signatures provide weight that meets the required threshold(s), if any;

    // TODO: if the first operation's source account does not exist
    // TODO: verify that remaining signature count is one;
    // TODO: verify that remaining signature is correct for the master key of the Client Account

    // TODO: if the transaction contains a Manage Data operation with the key client_domain
    // TODO: verify that the transaction was signed by the source account of the Manage Data operation

    // TODO: verify that transaction containing additional Manage Data operations have their source account set to the Server Account;

    // verify that transaction sequenceNumber is equal to zero;
    if (xdr.sequence !== '0') {
      return false;
    }

    console.log(xdr.signatures);

    return true;
  }

  defaultMessage() {
    return 'Transaction is not a valid challenge transaction!';
  }
}
