import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let tokenService: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenService],
    }).compile();

    tokenService = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(tokenService).toBeDefined();
  });
  it('should return a token when provided a transaction', async () => {
    const transaction = {
      transaction:
        'AAAAAgAAAACgGsgRTcnGCG4fxZ0FqA74qH1M5V23COm4kwttDsWcawAAAMgAAAAAAAAAAAAAAAEAAAAAYVN5RwAAAABhU3pzAAAAAAAAAAIAAAABAAAAAFfiYSlBtYn0t91Nb4LJZ6J04NgfI82pebF6oEL/Zx+kAAAACgAAAB1odHRwczovL3N0ZWxsYXIuYmVpZ24uZXMgYXV0aAAAAAAAAAEAAABAU3kzbUxZLzRWUFlKKzV1b051eWNFUXdLOVFCOWUxL29nUzZ1YlZMWDJlRVRhbzhiRUlpempvYldUVDdlOS9PMAAAAAEAAAAAoBrIEU3JxghuH8WdBagO+Kh9TOVdtwjpuJMLbQ7FnGsAAAAKAAAAD3dlYl9hdXRoX2RvbWFpbgAAAAABAAAAHWh0dHBzOi8vc3RlbGxhci5iZWlnbi5lcy9hdXRoAAAAAAAAAAAAAAEOxZxrAAAAQAFsMVzNDVbiimo2B5ba8MXZ4SLJodTrEtYs1t1+Gcc5XFKQWCcitTDAIMy1PUpf3JuSsQcJrYvatClB7jhv6go=',
    };
    const tokenResponse = await tokenService.generateToken(transaction);
    expect(tokenResponse).toBeInstanceOf(Object);
    expect(tokenResponse).toEqual({
      token: expect.any(String),
    });
  });

  it('should return a decoded token when provided an encoded token', async () => {
    const encodedToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2V4YW1wbGUuY29tL2F1dGgiLCJzdWIiOiJHQkw2RVlKSklHMllUNUZYM1ZHVzdBV0pNNlJISllHWUQ0UjQzS0xaV0Y1S0FRWDdNNFAySVRWSSIsImlhdCI6IjE1MTYyMzkwMjIiLCJleHAiOiIxNTE2MzI1NDIyIn0.jDm8Hlj4gD35-fqIhm8Lbl7G0A7GCxtA8zE88zFKYv8';
    const tokenResponse = await tokenService.decodeToken(encodedToken);
    expect(tokenResponse).toBeInstanceOf(Object);
    expect(tokenResponse).toMatchObject({
      token: expect.objectContaining({
        sub: 'GBL6EYJJIG2YT5FX3VGW7AWJM6RHJYGYD4R43KLZWF5KAQX7M4P2ITVI',
        iat: '1516239022',
        exp: '1516325422',
      }),
    });
  });

  // TODO: Add tests for muxed accounts and memos
});
