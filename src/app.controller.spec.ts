import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { ChallengeService } from './challenge/challenge.service';
import { TokenService } from './token/token.service';
import { AuthGuard } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      controllers: [AppController],
      providers: [ChallengeService, TokenService],
    })
      .overrideGuard(AuthGuard())
      .useValue({ canActivate: () => true })
      .compile();

    appController = app.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });
  it('should return a decoded token when provided an encoded token', async () => {
    const encodedToken = {
      headers: {
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2V4YW1wbGUuY29tL2F1dGgiLCJzdWIiOiJHQkw2RVlKSklHMllUNUZYM1ZHVzdBV0pNNlJISllHWUQ0UjQzS0xaV0Y1S0FRWDdNNFAySVRWSSIsImlhdCI6IjE1MTYyMzkwMjIiLCJleHAiOiIxNTE2MzI1NDIyIn0.jDm8Hlj4gD35-fqIhm8Lbl7G0A7GCxtA8zE88zFKYv8',
      },
    };
    const tokenResponse = await appController.decodeToken(encodedToken);
    expect(tokenResponse).toBeInstanceOf(Object);
    expect(tokenResponse).toMatchObject({
      token: expect.objectContaining({
        sub: 'GBL6EYJJIG2YT5FX3VGW7AWJM6RHJYGYD4R43KLZWF5KAQX7M4P2ITVI',
        iat: '1516239022',
        exp: '1516325422',
      }),
    });
  });
});
