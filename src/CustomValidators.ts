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
const HOME_DOMAIN = process.env.HOME_DOMAIN;
const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015';
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

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
    try {
      return StellarSdk.xdr.TransactionEnvelope.validateXDR(
        input,
        validationArguments.constraints[0],
      );
    } catch {
      return false;
    }
  }

  defaultMessage() {
    return 'Transaction is not a valid XDR transaction!';
  }
}

@ValidatorConstraint({ name: 'validatechallenge', async: true })
export class isValidChallenge implements ValidatorConstraintInterface {
  async validate(input: string) {
    try {
      StellarSdk.Utils.readChallengeTx(
        input,
        sourcePublicKey,
        NETWORK_PASSPHRASE,
        HOME_DOMAIN,
        HOME_DOMAIN + '/auth',
      );
    } catch {
      return false;
    }

    return true;
  }

  defaultMessage() {
    return 'Transaction is not a valid challenge transaction!';
  }
}

@ValidatorConstraint({ name: 'validatesignatures', async: true })
export class hasValidSignatures implements ValidatorConstraintInterface {
  async validate(input: string) {
    try {
      // Decode the received input as a base64-urlencoded XDR representation of Stellar transaction envelope;
      const xdr = new StellarSdk.Transaction(input, NETWORK_PASSPHRASE);

      // Retrieve the Client Account to check thresholds and signature weights.
      const clientAccount = await server.loadAccount(xdr.operations[0].source);

      // Check if high_threshold is higher than 0. If it is, verify that the signatures provide weight that meets this threshold.
      if (clientAccount.thresholds.high_threshold > 0) {
        StellarSdk.Utils.verifyChallengeTxSigners(
          input,
          sourcePublicKey,
          NETWORK_PASSPHRASE,
          StellarSdk.Utils.gatherTxSigners(
            xdr,
            xdr.operations.map((x) => {
              console.log(x.source);
              return x.source;
            }),
          ),
          HOME_DOMAIN,
          HOME_DOMAIN + '/auth',
        );
      } else {
        StellarSdk.Utils.verifyChallengeTxThreshold(
          input,
          sourcePublicKey,
          NETWORK_PASSPHRASE,
          clientAccount.thresholds.high_threshold,
          clientAccount.signers,
          HOME_DOMAIN,
          HOME_DOMAIN + '/auth',
        );
      }
    } catch {
      return false;
    }

    return true;
  }

  defaultMessage() {
    return 'Signatures are not valid or do not meet the required threshold!';
  }
}
