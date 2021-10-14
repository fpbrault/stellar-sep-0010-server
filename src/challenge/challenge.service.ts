import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Challenge } from '../challenge';
import * as StellarSdk from 'stellar-sdk';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';
import * as toml from 'toml';

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

export type ChallengeResponse =
  | {
      transaction: string;
      network_passphrase: string;
    }
  | string;

/**
 * Handles SEP-0010 challenge generation
 *
 * @export
 * @class ChallengeService
 */
@Injectable()
export class ChallengeService {
  private readonly logger = new Logger(ChallengeService.name);

  /**
   * Returns the public key of a client domain if it exists
   *
   * @param {string} client_domain
   * @return {Promise<StellarSdk.xdr.PublicKey>}
   * @memberof ChallengeService
   */
  async getSigningKey(
    client_domain: string,
  ): Promise<StellarSdk.xdr.PublicKey> {
    try {
      const client_domain_signing_key = client_domain
        ? await fetch(
            new URL('/.well-known/stellar.toml', 'https://' + client_domain),
            {
              headers: {
                Accept: 'text/plain',
                'Content-Type': 'text/plain',
              },
              method: 'GET',
            },
          )
            .then((response: { text: () => any }) => response.text())
            .then((data: string) => {
              if (toml.parse(data).SIGNING_KEY) {
                return toml.parse(data).SIGNING_KEY;
              }
            })
        : null;
      return client_domain_signing_key;
    } catch {
      throw new BadRequestException(
        "Unable to fetch 'client_domain' SIGNING_KEY",
      );
    }
  }

  /**
   * Generates a SEP-0010 challenge
   *
   * @param {Challenge} challenge
   * @return {Promise<ChallengeResponse>}
   * @memberof ChallengeService
   */
  async generateChallenge(challenge: Challenge): Promise<ChallengeResponse> {
    const client_domain_signing_key = await this.getSigningKey(
      challenge.client_domain,
    );

    this.logger.debug('home_domain:' + challenge.home_domain);
    this.logger.debug('client_account:' + challenge.account);
    this.logger.debug('client_domain_signing_key:' + client_domain_signing_key);
    this.logger.debug('client_domain:' + challenge.client_domain);
    this.logger.debug('Memo: ' + challenge.memo);

    // TODO: Add client_domain support when this gets added: https://github.com/stellar/js-stellar-sdk/issues/668
    const transaction = StellarSdk.Utils.buildChallengeTx(
      sourceKeypair,
      challenge.account,
      challenge.home_domain || HOME_DOMAIN,
      300,
      NETWORK_PASSPHRASE,
      HOME_DOMAIN + '/auth',
      challenge.memo,
    );

    return {
      transaction: transaction,
      network_passphrase: NETWORK_PASSPHRASE,
    };
  }
}
