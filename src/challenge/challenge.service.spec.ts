import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ChallengeService } from './challenge.service';

describe('ChallengeService', () => {
  let challengeService: ChallengeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChallengeService],
    }).compile();

    challengeService = module.get<ChallengeService>(ChallengeService);
  });

  it('should be defined', () => {
    expect(challengeService).toBeDefined();
  });
  it('should give the expected return', async () => {
    const challenge = {
      account: 'GBL6EYJJIG2YT5FX3VGW7AWJM6RHJYGYD4R43KLZWF5KAQX7M4P2ITVI',
    };
    const challengeResponse = await challengeService.generateChallenge(
      challenge,
    );
    expect(challengeResponse).toBeInstanceOf(Object);
    expect(challengeResponse).toEqual({
      network_passphrase: expect.any(String),
      transaction: expect.any(String),
    });
  });
  it('throws an error when account is invalid', async () => {
    expect.assertions(2);

    const challenge = {
      account: 'INVALIDACCOUNTSTRING',
    };
    try {
      await challengeService.generateChallenge(challenge);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toBe('Source address is invalid');
    }
  });
  it('throws an error when account is null', async () => {
    expect.assertions(2);

    const challenge = {
      account: null,
    };
    try {
      await challengeService.generateChallenge(challenge);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toBe("Cannot read property 'startsWith' of null");
    }
  });
  it('throws an error when signing key cannot be retrieved from client domain', async () => {
    expect.assertions(2);

    const challenge = {
      account: 'GBL6EYJJIG2YT5FX3VGW7AWJM6RHJYGYD4R43KLZWF5KAQX7M4P2ITVI',
      client_domain: 'example.coma',
    };
    try {
      await challengeService.getSigningKey(challenge.client_domain);
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      expect(e.message).toBe("Unable to fetch 'client_domain' SIGNING_KEY");
    }
  });
  it('should give the expected return', async () => {
    const challenge = {
      account: 'GBL6EYJJIG2YT5FX3VGW7AWJM6RHJYGYD4R43KLZWF5KAQX7M4P2ITVI',
      client_domain: 'stellar.beign.es',
    };
    const signingKeyResponse = await challengeService.getSigningKey(
      challenge.client_domain,
    );
    expect(typeof signingKeyResponse).toBe('string');
    expect(signingKeyResponse).toEqual(
      'GCQBVSARJXE4MCDOD7CZ2BNIB34KQ7KM4VO3OCHJXCJQW3IOYWOGWDLP',
    );
  });
});
