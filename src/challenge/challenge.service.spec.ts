import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ChallengeService } from './challenge.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Keypair, Networks } from 'stellar-sdk';

describe('ChallengeService', () => {
  let challengeService: ChallengeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        ChallengeService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'source.keypair') {
                return Keypair.random();
              }
              if (key === 'networkPassphrase') {
                return Networks.TESTNET;
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    challengeService = module.get<ChallengeService>(ChallengeService);
  });

  it('should be defined', () => {
    expect(challengeService).toBeDefined();
  });
  it('should return a valid SEP-0010 challenge transaction', async () => {
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
  it('should return the signing key retrieved from the client domain', async () => {
    const challenge = {
      account: 'GAVBS6SXMRD7C3IRN5K2SY5C2CAUFHBVOGWTQXADSBUHAFDDUKVTQWWY',
      client_domain: 'ultrastellar.com',
    };
    const signingKeyResponse = await challengeService.getSigningKey(
      challenge.client_domain,
    );
    expect(typeof signingKeyResponse).toBe('string');
    expect(signingKeyResponse).toEqual(
      'GA3UK3JHOYYD3TAUH5C7NDOUDWBRF5FC4MECXFA2VRPEHIDQUOJIVOAJ',
    );
  });

  // TODO: Add tests for muxed accounts and memos
});
