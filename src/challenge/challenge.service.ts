import { Injectable } from '@nestjs/common';
import { Challenge } from '../challenge';
import * as StellarSdk from 'stellar-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

const sourceSecretKey = process.env.SERVER_PRIVATE_KEY;
const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);
const HOME_DOMAIN = process.env.HOME_DOMAIN;
const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015';

type ChallengeResponse =
  | {
      transaction: string;
      network_passphrase: string;
    }
  | string;

@Injectable()
export class ChallengeService {
  /**
   * generateChallenge generates a SEP-0010 challenge.
   *
   * @param {Challenge} challenge
   * @return {*}  {Promise<ChallengeResponse>}
   * @memberof ChallengeService
   */
  async generateChallenge(challenge: Challenge): Promise<ChallengeResponse> {
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
