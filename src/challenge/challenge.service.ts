import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Challenge } from '../challenge';
import * as StellarSdk from 'stellar-sdk';
import fetch from 'node-fetch';
import * as toml from 'toml';
import { ConfigService } from '@nestjs/config';

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
  constructor(private configService: ConfigService) {}
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
    } catch (error) {
      Logger.error(error);
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

    let transaction;

    if (challenge.client_domain) {
      transaction = StellarSdk.Utils.buildChallengeTx(
        this.configService.get('source.keypair'),
        challenge.account,
        challenge.home_domain || this.configService.get('homeDomain'),
        300,
        this.configService.get('networkPassphrase'),
        this.configService.get('homeDomain'),
        challenge.memo,
        challenge.client_domain,
        client_domain_signing_key.toString(),
      );
    } else {
      transaction = StellarSdk.Utils.buildChallengeTx(
        this.configService.get('source.keypair'),
        challenge.account,
        challenge.home_domain || this.configService.get('homeDomain'),
        300,
        this.configService.get('networkPassphrase'),
        this.configService.get('homeDomain'),
        challenge.memo,
      );
    }
    console.log(transaction);

    return {
      transaction: transaction,
      network_passphrase: this.configService.get('networkPassphrase'),
    };
  }
}
