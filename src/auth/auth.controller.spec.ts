import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { ChallengeService } from '../challenge/challenge.service';
import { TokenService } from '../token/token.service';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Keypair } from 'stellar-sdk';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule],
      controllers: [AuthController],
      providers: [
        ChallengeService,
        TokenService,
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'source.keypair') {
                return Keypair.random();
              }
              if (key === 'jwtSecret') {
                return 'thisisthesecret';
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    //config = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('root', () => {
    it('throws an error when account is invalid', async () => {
      expect.assertions(2);

      const challenge = {
        account: 'INVALIDACCOUNTSTRING',
      };
      try {
        await controller.generateChallenge(challenge);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toBe('Source address is invalid');
      }
    });
  });
});
