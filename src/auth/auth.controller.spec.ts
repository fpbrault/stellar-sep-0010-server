import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('root', () => {
    it('should validate key is a valid EEd25519 key', async () => {
      expect(await controller.generateChallenge({ account: 'BADKEY' })).toBe(
        'Invalid Key',
      );
      expect(
        await controller.generateChallenge({
          account: 'GASYZVCLXYTFQZR7RWT5X4NQ7WDMHO6UVIPZKEIQVB73VUROMFNOROMW',
        }),
      ).not.toBe('Invalid Key');
    });
  });
});
