import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DefaultResponseModel {
  @ApiProperty({
    description: 'The error code',
    example: 400,
  })
  statusCode: number;
  @ApiProperty({
    description: 'The error message',
    example: 'Invalid account',
  })
  message: string;
  @ApiPropertyOptional({
    description: 'The error name',
    example: 'Bad Request',
  })
  error: string;
}

export class TokenResponseModel {
  @ApiProperty({
    description:
      'The JWT that can be used to authenticate future endpoint calls with the anchor',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3N0ZWxsYXIuYmVpZ24uZXMvYXV0aCIsInN1YiI6IkdBUktUTEJOSURaWU1WMldJTTJTS0pXS1NKWEFZTVUyTkhXUk5DWk5VMlFBUUhLNUhJNUdISTVNIiwiZXhwIjoxNTE2MjM5MDIyLCJpYXQiOjE1MTYyMzkwMjJ9.NGJO1PpG_xAwym_YZFz9glqDbuFtIvDoRI-c-Ic4s7s',
  })
  token: string;
}

export class ChallengeResponseModel {
  @ApiProperty({
    description: 'The Challenge transaction to sign',
    example:
      'AAAAAgAAAACgGsgRTcnGCG4fxZ0FqA74qH1M5V23COm4kwttDsWcawAAAMgAAAAAAAAAAAAAAAEAAAAAYdDLHwAAAABh0MxLAAAAAAAAAAIAAAABAAAAACKprC1A84ZXVkM1JSbKkm4MMppp7RaLLaagCB1dOjpjAAAACgAAACxwb3dlcmZ1bC1ldmVyZ2xhZGVzLTMwMTM4Lmhlcm9rdWFwcC5jb20gYXV0aAAAAAEAAABARW5FZG0zVDhscTB0WE5oaXQvbVdkdi9CT2I5ZzVsK2hSOWxwRld3TUJWNEVLRGdSdGc3WjFnQkJsKzBBOWEwQwAAAAEAAAAAoBrIEU3JxghuH8WdBagO+Kh9TOVdtwjpuJMLbQ7FnGsAAAAKAAAAD3dlYl9hdXRoX2RvbWFpbgAAAAABAAAAJ3Bvd2VyZnVsLWV2ZXJnbGFkZXMtMzAxMzguaGVyb2t1YXBwLmNvbQAAAAAAAAAAAQ7FnGsAAABA6DpzcpCQ4fndGoIp7i0jA5AJC1GmdHGbaF7Vh8hF2PxNO6CO3kcVgRt4C+ZYxMrMcbFrEVbaUVEOmR0IGP+RBg==',
  })
  transaction: string;
}

export class DecodedToken {
  @ApiProperty({
    description: 'The principal that issued a token',
    example: 'https://stellar.beign.es/auth',
  })
  iss: string;
  @ApiProperty({
    description: 'The principal that is the subject of the JWT',
    example: 'GA3YAO7A3N3FB2LWTM24DMYRGCH3XOQOLSMAGHKZLJWYNTLJ6XZKMR3Y',
  })
  sub: string;
  @ApiProperty({
    description: 'The time at which the JWT was issued',
    example: '1530644093',
  })
  iat: number;
  @ApiProperty({
    description:
      'The expiration time on or after which the JWT must not be accepted for processing',
    example: '1530644093',
  })
  exp: number;
  @ApiPropertyOptional({
    description:
      'A nonstandard JWT claim containing the client home domain, included if the challenge transaction contained a client_domain',
    example: 'stellar.beign.es',
  })
  client_domain: string;
}
export class DecodedTokenResponseModel {
  @ApiProperty({
    description: 'The decoded JWT token',
    type: DecodedToken,
    example: {
      iss: 'https://stellar.beign.es/auth',
      sub: 'GA3YAO7A3N3FB2LWTM24DMYRGCH3XOQOLSMAGHKZLJWYNTLJ6XZKMR3Y',
      iat: 1530644093,
      exp: 1530644093,
      client_domain: 'stellar.beign.es',
    },
  })
  token: string;
}

export class UnauthorizedResponseModel {
  @ApiProperty({
    description: 'The error code',
    example: 401,
  })
  statusCode: number;
  @ApiProperty({
    description: 'The error message',
    example: 'Unauthorized',
  })
  message: string;
}
