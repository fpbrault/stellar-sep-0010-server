import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Challenge } from '../challenge';
import * as StellarSdk from 'stellar-sdk';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';
import * as toml from 'toml';

dotenv.config();

const sourceSecretKey = process.env.SERVER_PRIVATE_KEY;
const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);
const HOME_DOMAIN = process.env.HOME_DOMAIN;
const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015';

export type ChallengeResponse =
  | {
      transaction: string;
      network_passphrase: string;
    }
  | string;

@Injectable()
export class ChallengeService {
  private readonly logger = new Logger(ChallengeService.name);

  async getSigningKey(client_domain) {
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

  async generateChallenge(challenge: Challenge): Promise<ChallengeResponse> {
    const client_domain_signing_key = await this.getSigningKey(
      challenge.client_domain,
    );

    this.logger.debug('home_domain:' + challenge.home_domain);
    this.logger.debug('client_account:' + challenge.account);
    this.logger.debug('client_domain_signing_key:' + client_domain_signing_key);
    this.logger.debug('client_domain:' + challenge.client_domain);
    this.logger.debug('Memo: ' + challenge.memo);

    // TODO: Add memo support once js-stellar-sdk supports it officially (only beta at the moment https://github.com/stellar/js-stellar-sdk/releases/tag/v9.0.0-beta.1)
    // TODO: Add client_domain support when this gets added: https://github.com/stellar/js-stellar-sdk/issues/668
    const transaction = StellarSdk.Utils.buildChallengeTx(
      sourceKeypair,
      challenge.account,
      challenge.home_domain || HOME_DOMAIN,
      300,
      NETWORK_PASSPHRASE,
      HOME_DOMAIN + '/auth',
    );

    return {
      transaction: transaction,
      network_passphrase: NETWORK_PASSPHRASE,
    };
  }
}
