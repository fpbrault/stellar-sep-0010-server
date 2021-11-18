import * as StellarSdk from 'stellar-sdk';

export default () => ({
  source: {
    keypair: StellarSdk.Keypair.fromSecret(process.env.SERVER_PRIVATE_KEY),
    publicKey: StellarSdk.Keypair.fromSecret(
      process.env.SERVER_PRIVATE_KEY,
    ).publicKey(),
    secretKey: process.env.SERVER_PRIVATE_KEY,
  },
  homeDomain: process.env.HOME_DOMAIN,
  networkPassphrase:
    process.env.NETWORK === 'PUBLIC'
      ? 'Public Global Stellar Network ; September 2015'
      : 'Test SDF Network ; September 2015',
  jwtSecret: process.env.JWT_SECRET,
  horizonServer: 'https://horizon-testnet.stellar.org',
  tomlExtras: process.env.TOML_EXTRAS ? process.env.TOML_EXTRAS : '',
});
