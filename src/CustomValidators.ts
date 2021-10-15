import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import * as StellarSdk from 'stellar-sdk';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
    //Check if muxed account
    if (value.startsWith('M')) {
      try {
        StellarSdk.MuxedAccount.fromAddress(value, '0');
        return true;
      } catch (error) {
        Logger.error(error);
        return false;
      }
    }

    return StellarSdk.StrKey.isValidEd25519PublicKey(value);
  }

  /**
   *
   *
   * @return {string}
   * @memberof isEd25519
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
    } catch (error) {
      Logger.error(error);
      return false;
    }
  }

  /**
   * Default validation error message
   *
   * @return {string}
   * @memberof isXDR
   */
  defaultMessage(): string {
    return 'Transaction is not a valid XDR transaction!';
  }
}

@ValidatorConstraint({ async: false })
export class isNotMuxedAccount implements ValidatorConstraintInterface {
  /**
   *
   *
   * @param {ValidationArguments} validationArguments
   * @return {boolean}
   * @memberof isNotMuxedAccount
   */
  validate(input: string, validationArguments: ValidationArguments): boolean {
    try {
      const [relatedPropertyName] = validationArguments.constraints;
      const relatedValue = (validationArguments.object as any)[
        relatedPropertyName
      ];
      return !relatedValue.startsWith('M');
    } catch (error) {
      Logger.error(error);
      return false;
    }
  }

  /**
   *
   *
   * @return {*}  {string}
   * @memberof isNotMuxedAccount
   */
  defaultMessage(): string {
    return 'Account is a muxed account!';
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
@Injectable()
export class isValidChallenge implements ValidatorConstraintInterface {
  constructor(private configService: ConfigService) {}
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
        this.configService.get('source.keypair').publicKey(),
        this.configService.get('networkPassphrase'),
        this.configService.get('homeDomain'),
        this.configService.get('homeDomain'),
      );
    } catch (error) {
      Logger.error(error);
      return false;
    }

    return true;
  }

  /**
   * Default validation error message
   *
   * @return {string}
   * @memberof isValidChallenge
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
@Injectable()
export class hasValidSignatures implements ValidatorConstraintInterface {
  constructor(private configService: ConfigService) {}
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
      const xdr = new StellarSdk.Transaction(
        input,
        this.configService.get('networkPassphrase'),
        true,
      );

      const server: StellarSdk.Server = new StellarSdk.Server(
        this.configService.get('horizonServer'),
      );
      // Retrieve the Client Account to check thresholds and signature weights.
      const clientAccount = await server.loadAccount(xdr.operations[0].source);

      const homeDomain = this.configService.get('homeDomain');

      // Check if high_threshold is higher than 0. If it is, verify that the signatures provide weight that meets this threshold.
      if (clientAccount.thresholds.high_threshold > 0) {
        StellarSdk.Utils.verifyChallengeTxSigners(
          input,
          this.configService.get('source.keypair').publicKey(),
          this.configService.get('networkPassphrase'),
          StellarSdk.Utils.gatherTxSigners(
            xdr,
            xdr.operations.map((x) => {
              return x.source;
            }),
          ),

          `${homeDomain}`,
          `${homeDomain}`,
        );
      } else {
        StellarSdk.Utils.verifyChallengeTxThreshold(
          input,
          this.configService.get('source.keypair').publicKey(),
          this.configService.get('networkPassphrase'),
          clientAccount.thresholds.high_threshold,
          clientAccount.signers,
          `${homeDomain}`,
          `${homeDomain}`,
        );
      }
    } catch (error) {
      Logger.error(error);
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
