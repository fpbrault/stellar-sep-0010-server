import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import * as StellarSdk from 'stellar-sdk';
import * as dotenv from 'dotenv';

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
/** URL of the horizon server
 * @type {StellarSdk.Server}  */
const server: StellarSdk.Server = new StellarSdk.Server(
  'https://horizon-testnet.stellar.org',
);

/**
 * Validates that the account public key is a valid Ed25519 key
 *
 * @export
 * @class isEd25519
 * @implements {ValidatorConstraintInterface}
 */
@ValidatorConstraint({ name: 'ed25519key', async: false })
export class isEd25519 implements ValidatorConstraintInterface {
  /**
   * Validation
   *
   * @param {string} value
   * @return {boolean}
   * @memberof isEd25519
   */
  validate(value: string): boolean {
    return StellarSdk.StrKey.isValidEd25519PublicKey(value);
  }

  /**
   * Default validation error message
   *
   * @return {string}
   * @memberof hasValidSignatures
   */
  defaultMessage(): string {
    return 'Key is not a valid Ed25519 Public Key!';
  }
}

/**
 * Validates that the transaction is a valid XDR transaction envelope
 *
 * @export
 * @class isXDR
 * @implements {ValidatorConstraintInterface}
 */
@ValidatorConstraint({ name: 'xdrtransaction', async: false })
export class isXDR implements ValidatorConstraintInterface {
  /**
   * Validation
   *
   * @param {Buffer} input
   * @param {ValidationArguments} validationArguments
   * @return {boolean}
   * @memberof isXDR
   */
  validate(input: Buffer, validationArguments: ValidationArguments): boolean {
    try {
      return StellarSdk.xdr.TransactionEnvelope.validateXDR(
        input,
        validationArguments.constraints[0],
      );
    } catch {
      return false;
    }
  }

  /**
   * Default validation error message
   *
   * @return {string}
   * @memberof hasValidSignatures
   */
  defaultMessage(): string {
    return 'Transaction is not a valid XDR transaction!';
  }
}

/**
 * Validates that the challenge transaction contains the expected operations and other parameters
 *
 * @export
 * @class isValidChallenge
 * @implements {ValidatorConstraintInterface}
 */
@ValidatorConstraint({ name: 'validatechallenge', async: true })
export class isValidChallenge implements ValidatorConstraintInterface {
  /**
   * Validation
   *
   * @param {string} input
   * @return {boolean}
   * @memberof isValidChallenge
   */
  async validate(input: string): Promise<boolean> {
    try {
      StellarSdk.Utils.readChallengeTx(
        input,
        sourceKeypair.publicKey(),
        NETWORK_PASSPHRASE,
        HOME_DOMAIN,
        HOME_DOMAIN + '/auth',
      );
    } catch {
      return false;
    }

    return true;
  }

  /**
   * Default validation error message
   *
   * @return {string}
   * @memberof hasValidSignatures
   */
  defaultMessage(): string {
    return 'Transaction is not a valid challenge transaction!';
  }
}

/**
 * Validates that the required signatures are present on the transaction
 *
 * @export
 * @class hasValidSignatures
 * @implements {ValidatorConstraintInterface}
 */
@ValidatorConstraint({ name: 'validatesignatures', async: true })
export class hasValidSignatures implements ValidatorConstraintInterface {
  /**
   * Validation
   *
   * @param {string} input
   * @return {boolean}
   * @memberof hasValidSignatures
   */
  async validate(input: string): Promise<boolean> {
    try {
      // Decode the received input as a base64-urlencoded XDR representation of Stellar transaction envelope;
      const xdr = new StellarSdk.Transaction(input, NETWORK_PASSPHRASE);

      // Retrieve the Client Account to check thresholds and signature weights.
      const clientAccount = await server.loadAccount(xdr.operations[0].source);

      // Check if high_threshold is higher than 0. If it is, verify that the signatures provide weight that meets this threshold.
      if (clientAccount.thresholds.high_threshold > 0) {
        StellarSdk.Utils.verifyChallengeTxSigners(
          input,
          sourceKeypair.publicKey(),
          NETWORK_PASSPHRASE,
          StellarSdk.Utils.gatherTxSigners(
            xdr,
            xdr.operations.map((x) => {
              return x.source;
            }),
          ),
          HOME_DOMAIN,
          HOME_DOMAIN + '/auth',
        );
      } else {
        StellarSdk.Utils.verifyChallengeTxThreshold(
          input,
          sourceKeypair.publicKey(),
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

  /**
   * Default validation error message
   *
   * @return {string}
   * @memberof hasValidSignatures
   */
  defaultMessage(): string {
    return 'Signatures are not valid or do not meet the required threshold!';
  }
}
