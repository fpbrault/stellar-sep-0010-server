# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 0.1.0 (2021-12-20)


### Features

* 🎸 add memo/muxed account support ([2d21a8f](https://github.com/fpbrault/stellar-sep-0010-server/commit/2d21a8fdfc9648903b926f48c8d39a27d7e84f86))
* 🎸 added org email ([ce35737](https://github.com/fpbrault/stellar-sep-0010-server/commit/ce35737c2bd83f7f4166a86ac392dd63bc00ffe8))
* 🎸 added secured route to test JWT token ([bb42c3f](https://github.com/fpbrault/stellar-sep-0010-server/commit/bb42c3f20a21facca362ca006cb5513436807632))
* 🎸 added simple home page ([606350c](https://github.com/fpbrault/stellar-sep-0010-server/commit/606350cfedd48c41055941f7162dc8c161e4d323))
* 🎸 added stellar.toml file ([6dcb57d](https://github.com/fpbrault/stellar-sep-0010-server/commit/6dcb57ded93083e6310828063e6a52a075a169ff))
* 🎸 bump dependencies ([07bb4c3](https://github.com/fpbrault/stellar-sep-0010-server/commit/07bb4c3d80247d281f7727c01879f7936642f6ee))
* 🎸 bump stellar-sdk to 9.1.0 ([a0611f6](https://github.com/fpbrault/stellar-sep-0010-server/commit/a0611f68ad835500ad874dd88c45522ded669d54))
* 🎸 enabled CORS ([53ff16b](https://github.com/fpbrault/stellar-sep-0010-server/commit/53ff16bc3c5a7c29cc32ffe0aea70fae1d2eb2f6))
* 🎸 enabled CORS for static content ([6e78bf4](https://github.com/fpbrault/stellar-sep-0010-server/commit/6e78bf4afd5e8460f41a8d9a4ab23b85c97af2e0))
* 🎸 generate stellar.toml dynamically ([d2118cc](https://github.com/fpbrault/stellar-sep-0010-server/commit/d2118cc4b1e80d59e290c62da6cbe32bcc1d2d9d))
* 🎸 improved challenge validation ([8982d9a](https://github.com/fpbrault/stellar-sep-0010-server/commit/8982d9a8b870d1c2dbb3e3e71f2154ccabc07aec))
* 🎸 moved code out of controllers and into services ([6f0de7a](https://github.com/fpbrault/stellar-sep-0010-server/commit/6f0de7aa3c68448d8c9e39063b771386863db169))
* 🎸 retrieve signing key from client_domain when present ([58ddc5e](https://github.com/fpbrault/stellar-sep-0010-server/commit/58ddc5edda7fe57ac4a17f46e01841044847afbb))
* 🎸 simplified challenge build and validate ([8f5c35e](https://github.com/fpbrault/stellar-sep-0010-server/commit/8f5c35e86ab05dfd3c1d505abf243b74aa83a9f6))
* 🎸 simplified index.html ([1b2163d](https://github.com/fpbrault/stellar-sep-0010-server/commit/1b2163dd0274f0e79208c8e478c1126a1d889ada))
* 🎸 token endpoint now actually returns a valid JWT token ([b07fb44](https://github.com/fpbrault/stellar-sep-0010-server/commit/b07fb4457c18360a4aad013842835bcad886adec))
* 🎸 use @nestjs/config for configuration ([3b857d3](https://github.com/fpbrault/stellar-sep-0010-server/commit/3b857d32501de9871007242bfb34a3b25c7e8ba8))


### Bug Fixes

* 🐛 added FQDN check on home_domain ([cf45669](https://github.com/fpbrault/stellar-sep-0010-server/commit/cf456697c4f2574f6d1feb81c42eea39bb5f8706))
* 🐛 added jsonwebtoken to package.json ([a632002](https://github.com/fpbrault/stellar-sep-0010-server/commit/a6320020ba40c0d75b94457b6f3dea219d0161b1))
* 🐛 added try/catch for xdr validation ([8cdf3d3](https://github.com/fpbrault/stellar-sep-0010-server/commit/8cdf3d31647103a87e9317704ddf75b30f67f7f1))
* 🐛 fixed issue with home domain validation ([bc2f8bf](https://github.com/fpbrault/stellar-sep-0010-server/commit/bc2f8bf1a9381f1b4ae41f6eb5a13ec0bee43798))
* 🐛 fixed missing protocol for WEB_AUTH_ENDPOINT ([6244d65](https://github.com/fpbrault/stellar-sep-0010-server/commit/6244d658fd74174e76d7293c0fe3cefdcccb2a2d))
* 🐛 fixes error when client_domain is undefined ([8020ad9](https://github.com/fpbrault/stellar-sep-0010-server/commit/8020ad934d493f1979794604beeac424ca681d34))
* 🐛 fixes WEB_AUTH_ENDPOINT value ([aa05d89](https://github.com/fpbrault/stellar-sep-0010-server/commit/aa05d8974b007b04738b690909993c01a98abd71))
* 🐛 handle stellar toml without signing key entry ([fb0e8b5](https://github.com/fpbrault/stellar-sep-0010-server/commit/fb0e8b5de006396995e390a3bc0849f57aa0d121))
* 🐛 removed /auth from webAuthDomain in challenge validation ([7433be2](https://github.com/fpbrault/stellar-sep-0010-server/commit/7433be24975d9e920ce41a0640b224192b419d73))
* 🐛 removed debug logging ([07e16f5](https://github.com/fpbrault/stellar-sep-0010-server/commit/07e16f53e0685304dd27cfdb26d0bfca205db77d))
* 🐛 removed extra quotes from signing key ([f5d1a6e](https://github.com/fpbrault/stellar-sep-0010-server/commit/f5d1a6e141e5adce03a3fe4eda9137e9bd5ed92a))
* 🐛 updated yarn.lock ([79620c4](https://github.com/fpbrault/stellar-sep-0010-server/commit/79620c4f35e06e1e76060a88d28f596095f9b6ac))
