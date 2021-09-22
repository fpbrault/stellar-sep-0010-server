import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should validate key is a valid EEd25519 key', async () => {
      expect(await appController.generateChallenge('BADKEY')).toBe(
        'Invalid Key',
      );
      expect(
        await appController.generateChallenge(
          'GASYZVCLXYTFQZR7RWT5X4NQ7WDMHO6UVIPZKEIQVB73VUROMFNOROMW',
        ),
      ).not.toBe('Invalid Key');
    });
  });
});
