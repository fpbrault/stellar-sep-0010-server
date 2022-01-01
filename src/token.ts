import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import {
  hasValidSignatures,
  isValidChallenge,
  isXDR,
} from './CustomValidators';

/**
 * SEP-0010 Token Request Parameters
 *
 * @export
 * @class Token
 */
export class TokenDto {
  @ApiProperty({
    description: 'The base64 encoded signed challenge transaction XDR',
    example:
      'AAAAAgAAAACgGsgRTcnGCG4fxZ0FqA74qH1M5V23COm4kwttDsWcawAAAMgAAAAAAAAAAAAAAAEAAAAAYdDLHwAAAABh0MxLAAAAAAAAAAIAAAABAAAAACKprC1A84ZXVkM1JSbKkm4MMppp7RaLLaagCB1dOjpjAAAACgAAACxwb3dlcmZ1bC1ldmVyZ2xhZGVzLTMwMTM4Lmhlcm9rdWFwcC5jb20gYXV0aAAAAAEAAABARW5FZG0zVDhscTB0WE5oaXQvbVdkdi9CT2I5ZzVsK2hSOWxwRld3TUJWNEVLRGdSdGc3WjFnQkJsKzBBOWEwQwAAAAEAAAAAoBrIEU3JxghuH8WdBagO+Kh9TOVdtwjpuJMLbQ7FnGsAAAAKAAAAD3dlYl9hdXRoX2RvbWFpbgAAAAABAAAAJ3Bvd2VyZnVsLWV2ZXJnbGFkZXMtMzAxMzguaGVyb2t1YXBwLmNvbQAAAAAAAAAAAQ7FnGsAAABA6DpzcpCQ4fndGoIp7i0jA5AJC1GmdHGbaF7Vh8hF2PxNO6CO3kcVgRt4C+ZYxMrMcbFrEVbaUVEOmR0IGP+RBg==',
  })
  @Validate(isXDR, ['base64'], {
    message:
      'Transaction is not a valid base64-encoded XDR transaction enveloppe!',
  })
  @Validate(isValidChallenge, {
    message: 'Transaction is not a valid challenge transaction!',
  })
  @Validate(hasValidSignatures, {
    message: 'Signatures are not valid or do not meet the required threshold!',
  })
  readonly transaction: string;
}
